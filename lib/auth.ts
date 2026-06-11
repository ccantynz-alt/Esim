import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal signed-cookie sessions.
 *
 * Customer login is passwordless (email only) — a stand-in for real magic
 * links / OAuth; swap in a proper auth provider before launch. Admin login
 * uses ADMIN_PASSWORD. Cookies are HMAC-signed with AUTH_SECRET.
 */

export { SESSION_COOKIE } from "./auth-edge";
import { SESSION_COOKIE } from "./auth-edge";

const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-before-launch";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "layova-admin";

export function isAuthHardened(): boolean {
  return Boolean(process.env.AUTH_SECRET && process.env.ADMIN_PASSWORD);
}

export interface Session {
  email: string;
  name: string;
  role: "customer" | "admin";
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function encodeSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function setSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function verifyAdminPassword(password: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}
