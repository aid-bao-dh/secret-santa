import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminPassword,
  getAdminSessionToken,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const submitted = String(password ?? "").trim();
    const correctPassword = getAdminPassword();

    if (submitted && submitted === correctPassword) {
      const token = getAdminSessionToken();
      const res = NextResponse.json(
        {
          success: true,
          token,
          message: "Đăng nhập Admin thành công!",
        },
        { headers: { "Cache-Control": "no-store" } }
      );

      res.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 12, // 12 hours
      });

      return res;
    }

    return NextResponse.json(
      { success: false, message: "Mật khẩu Admin không chính xác!" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Lỗi xử lý yêu cầu." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json(
    { success: true, message: "Đã đăng xuất." },
    { headers: { "Cache-Control": "no-store" } }
  );
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
