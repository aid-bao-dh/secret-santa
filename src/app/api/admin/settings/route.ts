import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getSettings, updateSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, message: "Lỗi đọc cài đặt." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const allowed: Record<string, unknown> = {};
    if (typeof body.rules === "string") allowed.rules = body.rules;
    if (typeof body.eventDate === "string") allowed.eventDate = body.eventDate;
    if (typeof body.revealDate === "string") allowed.revealDate = body.revealDate;
    if (typeof body.companyDomain === "string") allowed.companyDomain = body.companyDomain;
    if (typeof body.companyName === "string") allowed.companyName = body.companyName;
    if (typeof body.companyLogo === "string") allowed.companyLogo = body.companyLogo;
    if (Array.isArray(body.penalties)) {
      allowed.penalties = body.penalties.filter((p: unknown): p is string => typeof p === "string");
    }

    const updated = await updateSettings(allowed);
    revalidatePath("/");
    return NextResponse.json({ success: true, settings: updated, message: "Đã cập nhật cài đặt thành công!" });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ success: false, message: "Lỗi lưu cài đặt." }, { status: 500 });
  }
}
