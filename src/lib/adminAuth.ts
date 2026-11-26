import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "ss_admin_session";

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || "admin123").trim();
}

export function getAdminSessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(`secret-santa-admin-session:${getAdminPassword()}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminToken(req: NextRequest): boolean {
  const expectedToken = getAdminSessionToken();
  const validPassword = getAdminPassword();

  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value?.trim();
  if (cookieToken && safeEqual(cookieToken, expectedToken)) {
    return true;
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  const headerToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!headerToken) return false;

  return safeEqual(headerToken, expectedToken) || safeEqual(headerToken, validPassword);
}
