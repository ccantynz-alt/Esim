/**
 * Demo data backing the customer and admin dashboards until a real
 * database + auth provider are connected. Shapes here are the contract
 * the real backend should satisfy.
 */

export type EsimStatus = "active" | "ready" | "expired";
export type OrderStatus = "paid" | "pending" | "refunded";

export interface CustomerEsim {
  id: string;
  countryCode: string;
  planLabel: string;
  dataGb: number | "unlimited";
  usedGb: number;
  days: number;
  daysLeft: number;
  status: EsimStatus;
  activatedAt?: string;
  iccid: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  countryCode: string;
  planLabel: string;
  amountUsd: number;
  status: OrderStatus;
}

export const demoUser = {
  name: "Alex Traveler",
  email: "alex@example.com",
  memberSince: "2026-01-12",
};

export const demoEsims: CustomerEsim[] = [
  {
    id: "esim_jp_01",
    countryCode: "JP",
    planLabel: "Explorer",
    dataGb: 5,
    usedGb: 2.4,
    days: 30,
    daysLeft: 18,
    status: "active",
    activatedAt: "2026-05-23",
    iccid: "8910 3905 1002 4471 882",
  },
  {
    id: "esim_th_01",
    countryCode: "TH",
    planLabel: "Nomad",
    dataGb: 10,
    usedGb: 0,
    days: 30,
    daysLeft: 30,
    status: "ready",
    iccid: "8910 3905 1002 9913 045",
  },
  {
    id: "esim_fr_01",
    countryCode: "FR",
    planLabel: "Starter",
    dataGb: 1,
    usedGb: 1,
    days: 7,
    daysLeft: 0,
    status: "expired",
    activatedAt: "2026-03-02",
    iccid: "8910 3905 1002 1188 230",
  },
];

export const demoOrders: Order[] = [
  { id: "ord_1042", date: "2026-06-08", customer: "Alex Traveler", email: "alex@example.com", countryCode: "TH", planLabel: "Nomad", amountUsd: 13.99, status: "paid" },
  { id: "ord_1041", date: "2026-06-08", customer: "Mia Chen", email: "mia@example.com", countryCode: "JP", planLabel: "Explorer", amountUsd: 9.99, status: "paid" },
  { id: "ord_1040", date: "2026-06-07", customer: "Liam O'Brien", email: "liam@example.com", countryCode: "US", planLabel: "Unlimited", amountUsd: 38.99, status: "paid" },
  { id: "ord_1039", date: "2026-06-07", customer: "Sofia Rossi", email: "sofia@example.com", countryCode: "TR", planLabel: "Traveler", amountUsd: 10.99, status: "pending" },
  { id: "ord_1038", date: "2026-06-06", customer: "Noah Smith", email: "noah@example.com", countryCode: "GB", planLabel: "Explorer", amountUsd: 11.99, status: "paid" },
  { id: "ord_1037", date: "2026-06-05", customer: "Emma Müller", email: "emma@example.com", countryCode: "ES", planLabel: "Nomad", amountUsd: 15.99, status: "refunded" },
  { id: "ord_1036", date: "2026-06-05", customer: "Yuki Tanaka", email: "yuki@example.com", countryCode: "AU", planLabel: "Traveler", amountUsd: 11.99, status: "paid" },
  { id: "ord_1035", date: "2026-06-04", customer: "Alex Traveler", email: "alex@example.com", countryCode: "JP", planLabel: "Explorer", amountUsd: 9.99, status: "paid" },
];

export const adminStats = {
  revenue30dUsd: 48230,
  orders30d: 3911,
  activeEsims: 2874,
  conversionRate: 3.8,
  topCountries: [
    { code: "JP", orders: 612 },
    { code: "TH", orders: 540 },
    { code: "US", orders: 488 },
    { code: "TR", orders: 365 },
    { code: "ES", orders: 301 },
  ],
};
