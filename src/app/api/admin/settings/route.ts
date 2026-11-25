import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getSettings, updateSettings } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi đọc cài đặt." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateSettings(body);
    revalidatePath("/");
    return NextResponse.json({ success: true, settings: updated, message: "Đã cập nhật cài đặt thành công!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Lỗi lưu cài đặt." }, { status: 500 });
  }
}
