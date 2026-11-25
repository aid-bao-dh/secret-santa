import * as XLSX from "xlsx";
import { IUser, IMatch } from "./types";

const TEMPLATE_HEADERS = [
  "STT",
  "Họ và Tên",
  "Email Công Ty",
  "4 Số Cuối ĐT",
  "Phòng Ban",
  "Link Ảnh Avatar",
  "Wishlist Quà",
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
  { wch: 38 }, // Wishlist Quà
  { wch: 38 }, // Đôi Nét Bản Thân
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
      "Wishlist Quà": "Bình giữ nhiệt màu pastel hoặc nến thơm mùi quế",
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
      "Wishlist Quà": "Lót chuột cỡ lớn, keycap hoặc móc khóa mini",
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
  wsData["!autofilter"] = { ref: "A1:R3" };

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
      "Cột / Mục": "Wishlist Quà & Đôi Nét Bản Thân",
      "Bắt buộc": "Khuyến khích",
      "Hướng dẫn & Lưu ý cho Ban Tổ Chức (Linh, Bảo, Nhi)":
        "Giúp Santa chọn quà đúng sở thích. Có thể để trống nếu không có yêu cầu đặc biệt.",
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
 * Exports current users and Secret Santa match results to a formatted Master Excel file.
 */
export function exportMasterExcel(users: IUser[], matches: IMatch[]): void {
  const exportRows = users.map((u, i) => {
    const matchAsSanta = matches.find(
      (m) => m.santaEmail.toLowerCase().trim() === u.email.toLowerCase().trim()
    );
    const matchAsRecipient = matches.find(
      (m) => m.recipientEmail.toLowerCase().trim() === u.email.toLowerCase().trim()
    );

    return {
      STT: i + 1,
      "Họ và Tên": u.name,
      "Email Công Ty": u.email,
      "4 Số Cuối ĐT": u.phoneLast4,
      "Phòng Ban": u.department,
      "Đã Mở Xem": u.hasViewed ? "Đã xem" : "Chưa xem",
      "Tặng Quà Cho (Recipient)": matchAsSanta
        ? `${matchAsSanta.recipientName} (${matchAsSanta.recipientDepartment})`
        : "Chưa ghép",
      "Được Tặng Bởi (Santa)": matchAsRecipient
        ? `${matchAsRecipient.santaName} (${matchAsRecipient.santaDepartment})`
        : "Chưa ghép",
      "Gợi Ý Hint 1": matchAsRecipient?.hints?.[0] || "",
      "Gợi Ý Hint 2": matchAsRecipient?.hints?.[1] || "",
      "Gợi Ý Hint 3": matchAsRecipient?.hints?.[2] || "",
      "Wishlist Quà": u.wishlist || "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 24 },
    { wch: 30 },
    { wch: 14 },
    { wch: 16 },
    { wch: 12 },
    { wch: 30 },
    { wch: 30 },
    { wch: 36 },
    { wch: 36 },
    { wch: 36 },
    { wch: 36 },
  ];
  worksheet["!rows"] = [{ hpt: 28 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Secret_Santa_Master");
  XLSX.writeFile(workbook, `Secret_Santa_Master_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
