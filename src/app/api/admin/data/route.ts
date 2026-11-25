import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getUsers, getMatches, getSettings, isMongoAvailable } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
  }

  try {
    const [users, matches, settings, isMongo] = await Promise.all([
      getUsers(),
      getMatches(),
      getSettings(),
      isMongoAvailable(),
    ]);

    return NextResponse.json({
      success: true,
      users,
      matches,
      settings,
      isMongo,
      stats: {
        totalUsers: users.length,
        totalMatched: matches.length,
        viewedCount: users.filter((u) => u.hasViewed).length,
      },
    });
  } catch (error: any) {
    console.error("Admin data error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải dữ liệu." }, { status: 500 });
  }
}
