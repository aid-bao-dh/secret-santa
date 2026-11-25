import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = getAdminPassword();

    if (password === correctPassword) {
      return NextResponse.json({
        success: true,
        token: correctPassword,
        message: "Đăng nhập Admin thành công!",
      });
    }

    return NextResponse.json(
      { success: false, message: "Mật khẩu Admin không chính xác!" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi xử lý yêu cầu." },
      { status: 500 }
    );
  }
}
