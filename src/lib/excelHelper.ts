import * as XLSX from "xlsx";
import { IUser, IMatch } from "./types";

const TEMPLATE_HEADERS = [
  "STT",
  "Họ và Tên",
  "Email Công Ty",
  "4 Số Cuối ĐT",
  "Phòng Ban",
  "Link Ảnh Avatar",
  "Đôi Nét Bản Thân",
  "Câu 1: Món ăn yêu thích nhất",
  "Câu 2: Đồ uống chân ái khi làm việc",
  "Câu 3: Màu sắc yêu thích",
  "Câu 4: Đi làm bằng phương tiện gì",
  "Câu 5: Cung hoàng đạo",
  "Câu 6: Câu cửa miệng khi deadline dí",
  "Câu 7: Thể loại phim hay xem",
  "Câu 8: Ca sĩ / Ban nhạc hay nghe",
  "Câu 9: Một điều ít ai biết về bạn",
  "Câu 10: Ước muốn lớn nhất mùa Noel",
] as const;

const TEMPLATE_COL_WIDTHS = [
  { wch: 6 },  // STT
  { wch: 24 }, // Họ và Tên
  { wch: 30 }, // Email Công Ty
  { wch: 15 }, // 4 Số Cuối ĐT
  { wch: 18 }, // Phòng Ban
  { wch: 42 }, // Link Ảnh Avatar
  { wch: 40 }, // Đôi Nét Bản Thân
  { wch: 30 }, // Câu 1
  { wch: 34 }, // Câu 2
  { wch: 26 }, // Câu 3
  { wch: 32 }, // Câu 4
  { wch: 22 }, // Câu 5
  { wch: 34 }, // Câu 6
  { wch: 28 }, // Câu 7
  { wch: 30 }, // Câu 8
  { wch: 32 }, // Câu 9
  { wch: 34 }, // Câu 10
];

/**
 * Generates and downloads a neatly sized, multi-sheet Excel template
 * for the organizing team (Linh, Bảo, Nhi) to collect participant data.
 */
export function downloadSampleTemplate(): void {
  const sampleRows = [
    {
      "STT": 1,
      "Họ và Tên": "Nguyễn Thùy Linh",
      "Email Công Ty": "linh.nguyen@globalsafe.vn",
      "4 Số Cuối ĐT": "1234",
      "Phòng Ban": "Marketing",
      "Link Ảnh Avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "Đôi Nét Bản Thân": "Thích bắt trend TikTok, fan trà sữa 0% đường",
      "Câu 1: Món ăn yêu thích nhất": "Bún chả phố cổ nhiều tỏi ớt",
      "Câu 2: Đồ uống chân ái khi làm việc": "Trà sữa ô long 0 đường nhiều trân châu",
      "Câu 3: Màu sắc yêu thích": "Xanh mint và hồng pastel",
      "Câu 4: Đi làm bằng phương tiện gì": "Xe Vision màu trắng",
      "Câu 5: Cung hoàng đạo": "Song Tử",
      "Câu 6: Câu cửa miệng khi deadline dí": "Ủa em tưởng tuần sau mới nộp?!",
      "Câu 7: Thể loại phim hay xem": "Phim tâm lý trinh thám Hàn Quốc",
      "Câu 8: Ca sĩ / Ban nhạc hay nghe": "Vũ & Chillies",
      "Câu 9: Một điều ít ai biết về bạn": "Từng đoạt giải nhì múa hồi cấp 2",
      "Câu 10: Ước muốn lớn nhất mùa Noel": "Được ngủ nướng 12 tiếng không bị gọi",
    },
    {
      "STT": 2,
      "Họ và Tên": "Trần Gia Bảo",
      "Email Công Ty": "bao.tran@globalsafe.vn",
      "4 Số Cuối ĐT": "0568",
      "Phòng Ban": "Tech",
      "Link Ảnh Avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "Đôi Nét Bản Thân": "Fullstack Dev thích gõ phím cơ và uống Americano",
      "Câu 1: Món ăn yêu thích nhất": "Pizza phô mai bò băm",
      "Câu 2: Đồ uống chân ái khi làm việc": "Americano đá không đường",
      "Câu 3: Màu sắc yêu thích": "Đen tuyền / Xám không gian",
      "Câu 4: Đi làm bằng phương tiện gì": "Xe tay côn Yamaha Exciter",
      "Câu 5: Cung hoàng đạo": "Bọ Cạp",
      "Câu 6: Câu cửa miệng khi deadline dí": "Trên máy em chạy bình thường nha!",
      "Câu 7: Thể loại phim hay xem": "Sci-Fi viễn tưởng",
      "Câu 8: Ca sĩ / Ban nhạc hay nghe": "Daft Punk & Đen Vâu",
      "Câu 9: Một điều ít ai biết về bạn": "Biết nấu bít tết cực ngon",
      "Câu 10: Ước muốn lớn nhất mùa Noel": "Deploy không lỗi production",
    },
  ];

  const wsData = XLSX.utils.json_to_sheet(sampleRows, {
    header: [...TEMPLATE_HEADERS],
  });

  // Set readable column widths, header height & autofilter
  wsData["!cols"] = TEMPLATE_COL_WIDTHS;
  wsData["!rows"] = [{ hpt: 28 }, { hpt: 24 }, { hpt: 24 }];
  wsData["!autofilter"] = { ref: "A1:Q3" };

  // Ensure "4 Số Cuối ĐT" column (D2, D3) keeps string format with leading zeroes
  for (const cellRef of ["D2", "D3"]) {
    if (wsData[cellRef]) {
      wsData[cellRef].t = "s";
      wsData[cellRef].z = "@";
    }
  }

  // Sheet 2: Clear Guide for Organizers
  const guideRows = [
    {
      "Cột / Mục": "Quy tắc chung",
      "Bắt buộc": "Quan trọng",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Giữ nguyên tên tiêu đề ở dòng 1 của sheet Danh_Sach_Thanh_Vien. Xóa 2 dòng mẫu trước hoặc ghi đè dữ liệu thật vào bên dưới.",
    },
    {
      "Cột / Mục": "Họ và Tên",
      "Bắt buộc": "Bắt buộc",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Họ tên đầy đủ để hiển thị trên thẻ nhiệm vụ và bưu thiếp tải về.",
    },
    {
      "Cột / Mục": "Email Công Ty",
      "Bắt buộc": "Bắt buộc",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Email duy nhất dùng để nhân viên đăng nhập mở hộp quà. Không trùng lặp.",
    },
    {
      "Cột / Mục": "4 Số Cuối ĐT",
      "Bắt buộc": "Bắt buộc",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Đúng 4 chữ số cuối điện thoại để làm khóa bảo mật (VD: 0568). Nếu Excel mất số 0 đầu (568), hệ thống tự bù thành 0568 khi Import.",
    },
    {
      "Cột / Mục": "Phòng Ban",
      "Bắt buộc": "Bắt buộc",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Ghi thống nhất tên phòng ban (VD: Marketing, Tech, HR, Sales...). Cần ít nhất 2 phòng ban và không để 1 phòng chiếm quá 50% tổng nhân sự để ghép khác phòng.",
    },
    {
      "Cột / Mục": "Link Ảnh Avatar",
      "Bắt buộc": "Khuyến khích",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Dán URL ảnh trực tiếp hoặc link Google Drive đã bật quyền 'Bất kỳ ai có đường liên kết' (hệ thống tự chuyển đổi link Drive khi Import).",
    },
    {
      "Cột / Mục": "Đôi Nét Bản Thân",
      "Bắt buộc": "Khuyến khích",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Giới thiệu ngắn về đồng nghiệp. Quà tặng sẽ tự do lựa chọn bất ngờ trong khoảng giá trị dưới 200.000đ.",
    },
    {
      "Cột / Mục": "Câu 1 -> Câu 10",
      "Bắt buộc": "Khuyến khích",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Hệ thống tự bốc ngẫu nhiên 3 câu trả lời để làm manh mối bí mật về Santa. Khuyên điền tối thiểu 3 câu cho mỗi người.",
    },
  ];

  const wsGuide = XLSX.utils.json_to_sheet(guideRows);
  wsGuide["!cols"] = [{ wch: 30 }, { wch: 14 }, { wch: 82 }];
  wsGuide["!rows"] = [{ hpt: 26 }, ...guideRows.map(() => ({ hpt: 32 }))];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, wsData, "Danh_Sach_Thanh_Vien");
  XLSX.utils.book_append_sheet(workbook, wsGuide, "Huong_Dan");
  XLSX.writeFile(workbook, "Mau_Danh_Sach_Secret_Santa.xlsx");
}

/**
 * Exports current users and Secret Santa match results to a beautifully formatted Master Excel file
 * with 3 organized sheets:
 * 1. Ket_Qua_Secret_Santa: Master matching records with full info & autofilter
 * 2. Diem_Danh_Dem_Tiec: Convenient print-ready checklist for the MC & Party Night on Dec 24
 * 3. Bao_Cao_Thong_Ke: Executive dashboard summary with statistics, department breakdown and rules
 */
export function exportMasterExcel(
  users: IUser[],
  matches: IMatch[],
  companyName = "GLOBAL SAFE"
): void {
  const now = new Date();
  const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${now.getFullYear()}`;
  const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // =========================================================================
  // SHEET 1: KẾT QUẢ GHÉP CẶP SECRET SANTA (MASTER MATCHING LIST)
  // =========================================================================
  const masterRows = users.map((u, i) => {
    const matchAsSanta = matches.find(
      (m) => m.santaEmail.toLowerCase().trim() === u.email.toLowerCase().trim()
    );
    const matchAsRecipient = matches.find(
      (m) => m.recipientEmail.toLowerCase().trim() === u.email.toLowerCase().trim()
    );

    return {
      "STT": i + 1,
      "Họ và Tên (Santa)": u.name,
      "Email Công Ty": u.email,
      "4 Số Cuối ĐT": u.phoneLast4,
      "Phòng Ban (Santa)": u.department,
      "Trạng Thái Mở Thư": u.hasViewed ? "✅ Đã Xem Thẻ" : "⏳ Chưa Xem",
      "Người Nhận Quà (Recipient)": matchAsSanta
        ? matchAsSanta.recipientName
        : "Chưa ghép",
      "Phòng Ban Người Nhận": matchAsSanta
        ? matchAsSanta.recipientDepartment
        : "Chưa ghép",
      "Email Người Nhận": matchAsSanta ? matchAsSanta.recipientEmail : "",
      "Đôi Nét Về Người Nhận": matchAsSanta
        ? users.find(
            (usr) =>
              usr.email.toLowerCase().trim() ===
              matchAsSanta.recipientEmail.toLowerCase().trim()
          )?.bio || "Đồng nghiệp thân thiện"
        : "",
      "Được Tặng Bởi (Santa Của Mình)": matchAsRecipient
        ? `${matchAsRecipient.santaName} (${matchAsRecipient.santaDepartment})`
        : "Chưa ghép",
      "Gợi Ý Manh Mối 1": matchAsRecipient?.hints?.[0] || "",
      "Gợi Ý Manh Mối 2": matchAsRecipient?.hints?.[1] || "",
      "Gợi Ý Manh Mối 3": matchAsRecipient?.hints?.[2] || "",
      "Ngân Sách Quà": "Dưới 200.000 VNĐ (Tự do)",
    };
  });

  const wsMaster = XLSX.utils.json_to_sheet(masterRows);
  wsMaster["!cols"] = [
    { wch: 6 },  // STT
    { wch: 24 }, // Họ và Tên (Santa)
    { wch: 30 }, // Email Công Ty
    { wch: 14 }, // 4 Số Cuối ĐT
    { wch: 18 }, // Phòng Ban (Santa)
    { wch: 18 }, // Trạng Thái Mở Thư
    { wch: 24 }, // Người Nhận Quà
    { wch: 22 }, // Phòng Ban Người Nhận
    { wch: 30 }, // Email Người Nhận
    { wch: 36 }, // Đôi Nét Về Người Nhận
    { wch: 28 }, // Được Tặng Bởi
    { wch: 36 }, // Gợi Ý 1
    { wch: 36 }, // Gợi Ý 2
    { wch: 36 }, // Gợi Ý 3
    { wch: 26 }, // Ngân Sách Quà
  ];
  wsMaster["!rows"] = [
    { hpt: 30 },
    ...masterRows.map(() => ({ hpt: 22 })),
  ];
  wsMaster["!autofilter"] = {
    ref: `A1:O${masterRows.length + 1}`,
  };

  // Ensure "4 Số Cuối ĐT" retains string format '@' with leading zeros
  for (let r = 2; r <= masterRows.length + 1; r++) {
    const cellRef = `D${r}`;
    if (wsMaster[cellRef]) {
      wsMaster[cellRef].t = "s";
      wsMaster[cellRef].z = "@";
    }
  }

  // =========================================================================
  // SHEET 2: CHECKLIST ĐÊM TIỆC GIÁNG SINH (PARTY NIGHT CHECKLIST)
  // =========================================================================
  const partyRows = users.map((u, i) => {
    const matchAsSanta = matches.find(
      (m) => m.santaEmail.toLowerCase().trim() === u.email.toLowerCase().trim()
    );

    return {
      "STT": i + 1,
      "Họ và Tên Santa": u.name,
      "Phòng Ban Santa": u.department,
      "Người Nhận Quà": matchAsSanta ? matchAsSanta.recipientName : "Chưa ghép",
      "Phòng Ban Nhận": matchAsSanta ? matchAsSanta.recipientDepartment : "Chưa ghép",
      "Đã Mang Quà Đến? [  ]": "[  ] Đã giao quà",
      "Người Nhận Đoán Đúng? [  ]": "[  ] Đúng / Sai",
      "Chịu Phạt Vòng Quay?": "",
      "Ghi Chú Ban Tổ Chức": "",
    };
  });

  const wsParty = XLSX.utils.json_to_sheet(partyRows);
  wsParty["!cols"] = [
    { wch: 6 },
    { wch: 24 },
    { wch: 18 },
    { wch: 24 },
    { wch: 18 },
    { wch: 24 },
    { wch: 26 },
    { wch: 22 },
    { wch: 30 },
  ];
  wsParty["!rows"] = [
    { hpt: 30 },
    ...partyRows.map(() => ({ hpt: 24 })),
  ];
  wsParty["!autofilter"] = {
    ref: `A1:I${partyRows.length + 1}`,
  };

  // =========================================================================
  // SHEET 3: BÁO CÁO THỐNG KÊ TỔNG HỢP (EXECUTIVE DASHBOARD SUMMARY)
  // =========================================================================
  const viewedCount = users.filter((u) => u.hasViewed).length;
  const deptMap: Record<string, number> = {};
  users.forEach((u) => {
    const dept = u.department?.trim() || "Chung";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  const summaryData: (string | number)[][] = [
    [`BÁO CÁO TỔNG QUAN SECRET SANTA 2026 - ${companyName}`],
    [`Thời gian xuất dữ liệu: ${formattedTime} ngày ${formattedDate}`],
    [],
    ["CHỈ SỐ TỔNG HỢP", "GIÁ TRỊ", "GHI CHÚ / ĐÁNH GIÁ"],
    ["Tổng số thành viên tham gia", users.length, "Đã có trong hệ thống"],
    ["Số cặp đã ghép thành công", matches.length, matches.length === users.length ? "Đã ghép đủ 100%" : "Chưa ghép đủ"],
    ["Số người đã mở xem thẻ quà", viewedCount, `${users.length > 0 ? Math.round((viewedCount / users.length) * 100) : 0}% hoàn thành mở thẻ`],
    ["Số người chưa mở thẻ quà", users.length - viewedCount, "BTC cần tiếp tục nhắc nhở"],
    ["Tổng số phòng ban tham gia", Object.keys(deptMap).length, "Đảm bảo ghép khác phòng ban"],
    [],
    ["PHÂN BỔ THEO PHÒNG BAN", "SỐ LƯỢNG NHÂN SỰ", "TỶ LỆ (%)"],
    ...Object.entries(deptMap).map(([dept, count]) => [
      dept,
      count,
      `${users.length > 0 ? Math.round((count / users.length) * 100) : 0}%`,
    ]),
    [],
    ["QUY ĐỊNH & THỂ LỆ SỰ KIỆN", "NỘI DUNG CHI TIẾT"],
    ["1. Ngân sách quà tặng", "Dưới 200.000 VNĐ. Tự do sáng tạo món quà bất ngờ, ý nghĩa và chân thành."],
    ["2. Bí mật tuyệt đối", "Giữ kín danh tính người mình tặng và danh tính Santa của mình đến đêm tiệc."],
    ["3. Ghép cặp khác bộ phận", "Thuật toán đảm bảo không ghép người cùng phòng ban để tăng tính gắn kết."],
    ["4. Vòng quay hình phạt", "Ai quên chuẩn bị quà hoặc đoán sai Santa trong buổi tiệc sẽ phải chịu phạt."],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [
    { wch: 32 },
    { wch: 24 },
    { wch: 48 },
  ];
  wsSummary["!rows"] = [
    { hpt: 28 }, // Title
    { hpt: 20 }, // Date
    { hpt: 12 }, // Empty
    { hpt: 26 }, // Header 1
    { hpt: 22 },
    { hpt: 22 },
    { hpt: 22 },
    { hpt: 22 },
    { hpt: 22 },
    { hpt: 12 },
    { hpt: 26 }, // Header 2
    ...Object.keys(deptMap).map(() => ({ hpt: 20 })),
    { hpt: 12 },
    { hpt: 26 }, // Header 3
    { hpt: 22 },
    { hpt: 22 },
    { hpt: 22 },
    { hpt: 22 },
  ];

  // =========================================================================
  // APPEND SHEETS TO WORKBOOK & DOWNLOAD
  // =========================================================================
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, wsMaster, "Ket_Qua_Secret_Santa");
  XLSX.utils.book_append_sheet(workbook, wsParty, "Diem_Danh_Dem_Tiec");
  XLSX.utils.book_append_sheet(workbook, wsSummary, "Bao_Cao_Thong_Ke");

  const safeCompanyName = companyName.replace(/\s+/g, "_");
  const fileName = `Ket_Qua_Secret_Santa_${safeCompanyName}_${now.toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

function normalizeAvatarUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  // Auto-convert Google Drive file share URLs into direct image URLs
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w600`;
  }
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}=w600`;
  }
  return url;
}

function cleanQuestionHeader(header: string): string {
  // Turn "Câu 1: Món ăn yêu thích nhất" -> "Món ăn yêu thích nhất"
  // or legacy "Câu 1 (Món ăn)" -> "Món ăn"
  const colonStripped = header.replace(/^Câu\s*\d+\s*[:\-]\s*/i, "").trim();
  const parenMatch = colonStripped.match(/^Câu\s*\d+\s*\((.+)\)$/i);
  if (parenMatch?.[1]) return parenMatch[1].trim();
  return colonStripped;
}

/**
 * Parses an uploaded Excel/CSV ArrayBuffer into normalized IUser records.
 */
export function parseUsersFromExcelBuffer(data: ArrayBuffer): IUser[] {
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const now = Date.now();
  const parsed: IUser[] = [];

  rawJson.forEach((row, idx) => {
    const nameRaw = String(row["Họ và Tên"] || row["Tên"] || row["Name"] || "").trim();
    const emailRaw = String(row["Email Công Ty"] || row["Email"] || row["Mail"] || "").trim().toLowerCase();

    // Skip empty trailing rows
    if (!nameRaw && !emailRaw) return;

    const digitsOnly = String(row["4 Số Cuối ĐT"] || row["SĐT Cuối"] || row["Phone"] || "0").replace(/\D/g, "");
    const phoneLast4 = digitsOnly.slice(-4).padStart(4, "0");

    const department = String(row["Phòng Ban"] || row["Bộ Phận"] || row["Department"] || "Chung").trim();
    const avatar = normalizeAvatarUrl(String(row["Link Ảnh Avatar"] || row["Ảnh"] || row["Avatar"] || ""));
    const wishlist = String(row["Wishlist Quà"] || row["Wishlist"] || "").trim();
    const bio = String(row["Đôi Nét Bản Thân"] || row["Bio"] || "").trim();

    const questions: { question: string; answer: string }[] = [];
    Object.keys(row).forEach((k) => {
      if (/^Câu\s*\d+/i.test(k) || k.includes("?")) {
        const answer = String(row[k] ?? "").trim();
        if (answer) {
          questions.push({
            question: cleanQuestionHeader(k),
            answer,
          });
        }
      }
    });

    parsed.push({
      id: `u_import_${now}_${idx}`,
      name: nameRaw || `Nhân sự ${idx + 1}`,
      email: emailRaw || `user${idx + 1}@company.com`,
      phoneLast4,
      department,
      avatar,
      wishlist,
      bio,
      questions,
      hasViewed: false,
    });
  });

  return parsed;
}
