import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Data layer for the store. Repository-pattern functions over an in-process
 * store with JSON-file persistence (.data/store.json) — survives restarts in
 * dev and on a long-running server.
 *
 * PRODUCTION NOTE: on serverless hosts (Vercel) this resets per cold start.
 * Before launch, reimplement these functions over Postgres/Neon — every
 * caller goes through this module, so nothing else changes.
 */

export type OrderStatus = "pending" | "paid" | "refunded" | "failed";
export type OrderKind = "new" | "topup";
export type EsimStatus = "ready" | "active" | "expired" | "deactivated";
export type EventLevel = "info" | "warn" | "error";

export interface UserRec {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface OrderRec {
  id: string;
  email: string;
  kind: OrderKind;
  planId: string;
  countryCode: string;
  planLabel: string;
  amountUsd: number;
  status: OrderStatus;
  esimId?: string;
  stripeSessionId?: string;
  createdAt: string;
}

export interface EsimRec {
  id: string;
  email: string;
  countryCode: string;
  planId: string;
  planLabel: string;
  dataGb: number | "unlimited";
  topUpGb: number;
  days: number;
  iccid: string;
  activationCode: string;
  deactivated: boolean;
  activatedAt?: string;
  createdAt: string;
}

export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface PartnerLeadRec {
  id: string;
  company: string;
  contactName: string;
  email: string;
  segment: string;
  /** Free-text need + quote summary captured from the quote builder. */
  details: string;
  estMonthlyTravelers?: number;
  status: LeadStatus;
  createdAt: string;
}

export interface EventRec {
  id: string;
  ts: string;
  level: EventLevel;
  type: string;
  message: string;
}

interface Store {
  users: UserRec[];
  orders: OrderRec[];
  esims: EsimRec[];
  events: EventRec[];
  leads?: PartnerLeadRec[];
}

const DATA_FILE = path.join(process.cwd(), ".data", "store.json");

declare global {
  // eslint-disable-next-line no-var
  var __layovaStore: Store | undefined;
}

function load(): Store {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Store;
  } catch {
    return { users: [], orders: [], esims: [], events: [] };
  }
}

function persist(store: Store) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store));
  } catch {
    // Read-only filesystem (serverless) — keep going in-memory.
  }
}

function getStore(): Store {
  globalThis.__layovaStore ??= load();
  return globalThis.__layovaStore;
}

export function logEvent(level: EventLevel, type: string, message: string) {
  const store = getStore();
  store.events.unshift({
    id: randomUUID(),
    ts: new Date().toISOString(),
    level,
    type,
    message,
  });
  store.events = store.events.slice(0, 500);
  persist(store);
}

// ---- Users ----

export function upsertUser(email: string, name?: string): UserRec {
  const store = getStore();
  let user = store.users.find((u) => u.email === email);
  if (!user) {
    user = {
      id: randomUUID(),
      email,
      name: name || email.split("@")[0],
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    logEvent("info", "user.created", `New customer ${email}`);
    persist(store);
  }
  return user;
}

export function listUsers(): UserRec[] {
  return [...getStore().users];
}

// ---- Orders ----

export function createOrder(
  input: Omit<OrderRec, "id" | "status" | "createdAt">,
): OrderRec {
  const store = getStore();
  const order: OrderRec = {
    ...input,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.orders.unshift(order);
  logEvent(
    "info",
    "order.created",
    `Order ${order.id.slice(0, 8)} (${order.kind}) ${order.planId} for ${order.email}`,
  );
  persist(store);
  return order;
}

export function updateOrder(
  id: string,
  patch: Partial<OrderRec>,
): OrderRec | undefined {
  const store = getStore();
  const order = store.orders.find((o) => o.id === id);
  if (order) {
    Object.assign(order, patch);
    persist(store);
  }
  return order;
}

export function getOrder(id: string): OrderRec | undefined {
  return getStore().orders.find((o) => o.id === id);
}

export function listOrders(email?: string): OrderRec[] {
  const orders = getStore().orders;
  return email ? orders.filter((o) => o.email === email) : [...orders];
}

// ---- eSIMs ----

export function createEsim(
  input: Omit<EsimRec, "id" | "topUpGb" | "deactivated" | "createdAt">,
): EsimRec {
  const store = getStore();
  const esim: EsimRec = {
    ...input,
    id: randomUUID(),
    topUpGb: 0,
    deactivated: false,
    createdAt: new Date().toISOString(),
  };
  store.esims.unshift(esim);
  logEvent(
    "info",
    "esim.provisioned",
    `eSIM ${esim.iccid} (${esim.countryCode} ${esim.planLabel}) for ${esim.email}`,
  );
  persist(store);
  return esim;
}

export function updateEsim(
  id: string,
  patch: Partial<EsimRec>,
): EsimRec | undefined {
  const store = getStore();
  const esim = store.esims.find((e) => e.id === id);
  if (esim) {
    Object.assign(esim, patch);
    persist(store);
  }
  return esim;
}

export function getEsim(id: string): EsimRec | undefined {
  return getStore().esims.find((e) => e.id === id);
}

export function listEsims(email?: string): EsimRec[] {
  const esims = getStore().esims;
  return email ? esims.filter((e) => e.email === email) : [...esims];
}

// ---- Partner leads (B2B pipeline) ----

export function createLead(
  input: Omit<PartnerLeadRec, "id" | "status" | "createdAt">,
): PartnerLeadRec {
  const store = getStore();
  const lead: PartnerLeadRec = {
    ...input,
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  store.leads = [lead, ...(store.leads ?? [])];
  logEvent("info", "lead.created", `B2B lead: ${lead.company} (${lead.segment}) — ${lead.email}`);
  persist(store);
  return lead;
}

export function listLeads(): PartnerLeadRec[] {
  return [...(getStore().leads ?? [])];
}

export function updateLeadStatus(
  id: string,
  status: LeadStatus,
): PartnerLeadRec | undefined {
  const store = getStore();
  const lead = (store.leads ?? []).find((l) => l.id === id);
  if (lead) {
    lead.status = status;
    logEvent("info", "lead.status", `Lead ${lead.company} → ${status}`);
    persist(store);
  }
  return lead;
}

export function listEvents(limit = 100): EventRec[] {
  return getStore().events.slice(0, limit);
}

// ---- Derived ----

export function esimStatus(esim: EsimRec): EsimStatus {
  if (esim.deactivated) return "deactivated";
  if (!esim.activatedAt) return "ready";
  const expires =
    new Date(esim.activatedAt).getTime() + esim.days * 86_400_000;
  return Date.now() > expires ? "expired" : "active";
}

export function esimDaysLeft(esim: EsimRec): number {
  if (!esim.activatedAt) return esim.days;
  const expires =
    new Date(esim.activatedAt).getTime() + esim.days * 86_400_000;
  return Math.max(0, Math.ceil((expires - Date.now()) / 86_400_000));
}

export function totalDataGb(esim: EsimRec): number | "unlimited" {
  return esim.dataGb === "unlimited" ? "unlimited" : esim.dataGb + esim.topUpGb;
}

export function storeStats() {
  const store = getStore();
  const paid = store.orders.filter((o) => o.status === "paid");
  const byCountry = new Map<string, number>();
  for (const o of paid) {
    byCountry.set(o.countryCode, (byCountry.get(o.countryCode) ?? 0) + 1);
  }
  return {
    revenueUsd: paid.reduce((sum, o) => sum + o.amountUsd, 0),
    orders: store.orders.length,
    paidOrders: paid.length,
    customers: store.users.length,
    esims: store.esims.length,
    activeEsims: store.esims.filter((e) => esimStatus(e) === "active").length,
    topCountries: [...byCountry.entries()]
      .map(([code, orders]) => ({ code, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5),
    eventCounts: {
      errors: store.events.filter((e) => e.level === "error").length,
      warnings: store.events.filter((e) => e.level === "warn").length,
    },
  };
}
