import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { bulkSaveUsers, clearMatches } from "@/lib/db";
import { MOCK_USERS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    await clearMatches();
    await bulkSaveUsers(MOCK_USERS);
    return NextResponse.json({
      success: true,
      message: `Đã nạp thành công ${MOCK_USERS.length} nhân sự mẫu (Linh, Bảo, Nhi, Khoa, Hà, Dũng) với đầy đủ ảnh, phòng ban và 10 câu hỏi!`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, message: "Lỗi nạp dữ liệu mẫu." }, { status: 500 });
  }
}
