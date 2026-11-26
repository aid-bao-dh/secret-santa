import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, getMatchForSanta, getMatchForRecipient, getUsers, getSettings, markUserViewed } from "@/lib/db";

function formatDayMonth(dateStr?: string, fallback = "27/11"): string {
  if (!dateStr) return fallback;
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}` : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phoneLast4 } = body;

    if (!email || !phoneLast4) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ Email công ty và 4 số cuối điện thoại." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phoneLast4.toString().trim();

    const user = await getUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email này không có trong danh sách tham gia Secret Santa. Vui lòng liên hệ BTC (Linh/Bảo/Nhi) để kiểm tra.",
        },
        { status: 404 }
      );
    }

    // Verify phoneLast4
    if (user.phoneLast4.trim() !== cleanPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "4 số cuối điện thoại không khớp với thông tin đã đăng ký. Vui lòng thử lại!",
        },
        { status: 401 }
      );
    }

    // Check if matches have been generated
    const matchAsSanta = await getMatchForSanta(cleanEmail);
    const matchAsRecipient = await getMatchForRecipient(cleanEmail);

    if (!matchAsSanta || !matchAsRecipient) {
      const settings = await getSettings();
      const dayLabel = formatDayMonth(settings.revealDate, "27/11");
      return NextResponse.json({
        success: true,
        notMatchedYet: true,
        currentUser: {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
        },
        userName: user.name,
        message: `Ban tổ chức đang chuẩn bị danh sách ghép cặp. Bạn vui lòng quay lại vào ngày công bố (${dayLabel}) nhé! 🎄`,
      });
    }

    // Mark viewed
    const wasViewed = !!user.hasViewed;
    await markUserViewed(cleanEmail);

    // Get full recipient profile
    const allUsers = await getUsers();
    const recipientUser = allUsers.find(
      (u) => u.email.toLowerCase().trim() === matchAsSanta.recipientEmail.toLowerCase().trim()
    );

    return NextResponse.json({
      success: true,
      currentUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
      },
      // Full info of person you are gifting to
      giftRecipient: {
        name: recipientUser ? recipientUser.name : matchAsSanta.recipientName,
        department: recipientUser ? recipientUser.department : matchAsSanta.recipientDepartment,
        avatar: recipientUser?.avatar || "",
        bio: recipientUser?.bio || "",
      },
      // Hints of who is YOUR Santa (identity concealed!)
      santaHints: matchAsRecipient.hints || [],
      wasViewedBefore: wasViewed,
    });
  } catch (error) {
    console.error("Reveal API Error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
