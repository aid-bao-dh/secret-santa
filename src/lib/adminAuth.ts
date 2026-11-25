import { NextRequest } from "next/server";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function verifyAdminToken(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const valid = getAdminPassword();
  return token === valid;
}
