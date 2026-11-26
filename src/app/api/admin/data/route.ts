import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { getUsers, getMatches, getSettings, isMongoAvailable } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    // Establish DB connection sequentially once before running parallel queries on cold start
    const isMongo = await isMongoAvailable();
    const [users, matches, settings] = await Promise.all([
      getUsers(),
      getMatches(),
      getSettings(),
    ]);

    return NextResponse.json(
      {
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
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Admin data error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải dữ liệu từ server." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
