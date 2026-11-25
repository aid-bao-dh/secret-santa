import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { bulkSaveUsers, clearUsers, getUsers } from "@/lib/db";
import { IUser } from "@/lib/types";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const incoming: IUser[] = Array.isArray(body) ? body : [body];

    // Sanitize
    const cleaned: IUser[] = incoming
      .filter((u) => u.name && u.email)
      .map((u, i) => ({
        id: u.id || `u_${Date.now()}_${i}`,
        name: u.name.trim(),
        email: u.email.toLowerCase().trim(),
        phoneLast4: (u.phoneLast4 || "0000").toString().trim(),
        department: (u.department || "Khác").trim(),
        avatar: u.avatar || "",
        bio: u.bio || "",
        wishlist: u.wishlist || "",
        questions: Array.isArray(u.questions) ? u.questions : [],
        hasViewed: false,
      }));

    if (cleaned.length === 0) {
      return NextResponse.json({ success: false, message: "Không tìm thấy dữ liệu hợp lệ để lưu." }, { status: 400 });
    }

    await bulkSaveUsers(cleaned);
    const updatedUsers = await getUsers();

    return NextResponse.json({
      success: true,
      message: `Đã lưu thành công ${cleaned.length} thành viên!`,
      totalUsers: updatedUsers.length,
    });
  } catch (error: any) {
    console.error("Users save error:", error);
    return NextResponse.json({ success: false, message: "Lỗi lưu dữ liệu nhân sự." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    await clearUsers();
    return NextResponse.json({ success: true, message: "Đã xóa toàn bộ danh sách thành viên và ghép cặp." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi xóa danh sách." }, { status: 500 });
  }
}
