import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getUsers, saveMatches, clearMatches } from "@/lib/db";
import { generateMatches } from "@/lib/matching";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    const users = await getUsers();
    if (users.length < 2) {
      return NextResponse.json(
        { success: false, message: "Danh sách cần ít nhất 2 người để ghép cặp." },
        { status: 400 }
      );
    }

    const result = generateMatches(users);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.warnings?.[0] || "Ghép cặp thất bại." },
        { status: 400 }
      );
    }

    await saveMatches(result.matches);

    return NextResponse.json({
      success: true,
      message: `Ghép cặp thành công cho ${result.matches.length} thành viên!`,
      matchesCount: result.matches.length,
      sameDepartmentCount: result.sameDepartmentCount,
      warnings: result.warnings,
    });
  } catch (error: any) {
    console.error("Match error:", error);
    return NextResponse.json({ success: false, message: "Lỗi ghép cặp." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    await clearMatches();
    return NextResponse.json({ success: true, message: "Đã hủy toàn bộ kết quả ghép cặp." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi hủy ghép cặp." }, { status: 500 });
  }
}
