import { IUser } from "./types";

export const MOCK_USERS: IUser[] = [
  {
    id: "u_linh_01",
    name: "Nguyễn Thùy Linh",
    email: "linh.nguyen@company.com",
    phoneLast4: "1234",
    department: "Marketing",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    bio: "Trầm tính nhưng thích bắt trend TikTok, fan cuồng trà sữa 0% đường.",
    wishlist: "Bình giữ nhiệt màu pastel, sổ tay bullet journal hoặc nến thơm mùi quế.",
    questions: [
      { question: "Món ăn yêu thích nhất", answer: "Bún chả phố cổ nhiều tỏi ớt" },
      { question: "Đồ uống chân ái khi làm việc", answer: "Trà sữa ô long 0 đường nhiều trân châu" },
      { question: "Màu sắc yêu thích", answer: "Xanh mint và hồng pastel" },
      { question: "Đi làm bằng phương tiện gì", answer: "Xe Vision màu trắng" },
      { question: "Cung hoàng đạo", answer: "Song Tử" },
      { question: "Câu cửa miệng khi deadline dí", answer: "Ủa em tưởng tuần sau mới nộp?!" },
      { question: "Thể loại phim hay xem", answer: "Phim tâm lý trinh thám Hàn Quốc" },
      { question: "Ca sĩ / Ban nhạc hay nghe", answer: "Vũ & Chillies" },
      { question: "Một điều ít ai biết về bạn", answer: "Từng đoạt giải nhì múa hồi cấp 2" },
      { question: "Ước muốn lớn nhất mùa Noel", answer: "Được ngủ nướng 12 tiếng không bị gọi" }
    ],
    hasViewed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "u_bao_02",
    name: "Trần Gia Bảo",
    email: "bao.tran@company.com",
    phoneLast4: "5678",
    department: "Tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Fullstack Developer thích gõ phím cơ lách cách và uống Americano không đường.",
    wishlist: "Lót chuột cỡ lớn, keycap dễ thương cho phím cơ hoặc móc khóa mini.",
    questions: [
      { question: "Món ăn yêu thích nhất", answer: "Pizza phô mai gấp đôi bò băm" },
      { question: "Đồ uống chân ái khi làm việc", answer: "Americano đá đậm vị không đường" },
      { question: "Màu sắc yêu thích", answer: "Đen tuyền / Xám không gian" },
      { question: "Đi làm bằng phương tiện gì", answer: "Xe tay côn Yamaha Exciter" },
      { question: "Cung hoàng đạo", answer: "Bọ Cạp" },
      { question: "Câu cửa miệng khi deadline dí", answer: "Tính năng này trên máy em chạy bình thường nha" },
      { question: "Thể loại phim hay xem", answer: "Sci-Fi viễn tưởng của Christopher Nolan" },
      { question: "Ca sĩ / Ban nhạc hay nghe", answer: "Daft Punk & Đen Vâu" },
      { question: "Một điều ít ai biết về bạn", answer: "Biết nấu ăn cực ngon, đặc biệt là món bít tết" },
      { question: "Ước muốn lớn nhất mùa Noel", answer: "Deploy hệ thống không bị lỗi production" }
    ],
    hasViewed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "u_nhi_03",
    name: "Phạm Uyển Nhi",
    email: "nhi.pham@company.com",
    phoneLast4: "9988",
    department: "HR",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Trưởng ban văn nghệ kiêm người nắm giữ mọi bí mật trong công ty.",
    wishlist: "Kem dưỡng da tay mùa đông, son dưỡng có màu nhẹ hoặc ly sứ Giáng sinh.",
    questions: [
      { question: "Món ăn yêu thích nhất", answer: "Bánh tráng trộn và trà đào cam sả" },
      { question: "Đồ uống chân ái khi làm việc", answer: "Matcha Latte ít ngọt" },
      { question: "Màu sắc yêu thích", answer: "Đỏ rượu vang và be ấm" },
      { question: "Đi làm bằng phương tiện gì", answer: "Grab Bike hoặc đi ké đồng nghiệp" },
      { question: "Cung hoàng đạo", answer: "Thiên Bình" },
      { question: "Câu cửa miệng khi deadline dí", answer: "Team ơi chiều nay có ai order gì không?" },
      { question: "Thể loại phim hay xem", answer: "Phim tình cảm lãng mạn hài hước (Rom-com)" },
      { question: "Ca sĩ / Ban nhạc hay nghe", answer: "Taylor Swift" },
      { question: "Một điều ít ai biết về bạn", answer: "Có chứng chỉ Yoga 200 giờ" },
      { question: "Ước muốn lớn nhất mùa Noel", answer: "Mọi người tham gia party đầy đủ và quẩy hết mình" }
    ],
    hasViewed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "u_khoa_04",
    name: "Đặng Đăng Khoa",
    email: "khoa.dang@company.com",
    phoneLast4: "4321",
    department: "Design",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    bio: "UI/UX Designer, dị ứng với font Comic Sans và khách hàng đòi logo to hơn.",
    wishlist: "Cây cảnh mini để bàn (sen đá/xương rồng) hoặc sổ sketch vẽ tay.",
    questions: [
      { question: "Món ăn yêu thích nhất", answer: "Sushi cá hồi tươi sống" },
      { question: "Đồ uống chân ái khi làm việc", answer: "Cà phê muối đá" },
      { question: "Màu sắc yêu thích", answer: "Cam đất và xanh Navy" },
      { question: "Đi làm bằng phương tiện gì", answer: "Xe đạp gấp phong cách vintage" },
      { question: "Cung hoàng đạo", answer: "Bảo Bình" },
      { question: "Câu cửa miệng khi deadline dí", answer: "Cho anh xin bản final_v3_chot_that_roi nhé" },
      { question: "Thể loại phim hay xem", answer: "Anime của Studio Ghibli" },
      { question: "Ca sĩ / Ban nhạc hay nghe", answer: "Lo-fi beats to relax/study to" },
      { question: "Một điều ít ai biết về bạn", answer: "Sưu tầm hơn 50 đôi vớ họa tiết kỳ lạ" },
      { question: "Ước muốn lớn nhất mùa Noel", answer: "Được khách hàng duyệt thiết kế ngay ở vòng 1" }
    ],
    hasViewed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "u_ha_05",
    name: "Hoàng Thanh Hà",
    email: "ha.hoang@company.com",
    phoneLast4: "8765",
    department: "Sales",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    bio: "Chiến thần chốt deal, năng lượng 200% mỗi sáng.",
    wishlist: "Pin sạc dự phòng mini, ô che mưa gập gọn tiện bỏ túi.",
    questions: [
      { question: "Món ăn yêu thích nhất", answer: "Lẩu Thái tomyum cay xé lưỡi" },
      { question: "Đồ uống chân ái khi làm việc", answer: "Nước ép cam nguyên chất không đường" },
      { question: "Màu sắc yêu thích", answer: "Vàng ánh kim và đỏ tươi" },
      { question: "Đi làm bằng phương tiện gì", answer: "Vespa đỏ thời thượng" },
      { question: "Cung hoàng đạo", answer: "Sư Tử" },
      { question: "Câu cửa miệng khi deadline dí", answer: "Khách vừa ký hợp đồng rồi anh em ơi!" },
      { question: "Thể loại phim hay xem", answer: "Phim hành động kịch tính Hollywood" },
      { question: "Ca sĩ / Ban nhạc hay nghe", answer: "Sơn Tùng M-TP" },
      { question: "Một điều ít ai biết về bạn", answer: "Rất sợ gián và bóng tối dù vẻ ngoài cực ngầu" },
      { question: "Ước muốn lớn nhất mùa Noel", answer: "Đạt 150% KPI quý 4" }
    ],
    hasViewed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "u_dung_06",
    name: "Lê Quốc Dũng",
    email: "dung.le@company.com",
    phoneLast4: "1122",
    department: "Tech",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    bio: "Devops kiêm chuyên gia cứu hỏa server ban đêm.",
    wishlist: "Gối tựa lưng công thái học hoặc bình nước thể thao 1 lít.",
    questions: [
      { question: "Món ăn yêu thích nhất", answer: "Cơm tấm sườn bì chả ốp la 2 trứng" },
      { question: "Đồ uống chân ái khi làm việc", answer: "Bạc xỉu nhiều sữa" },
      { question: "Màu sắc yêu thích", answer: "Xanh lá cây rêu" },
      { question: "Đi làm bằng phương tiện gì", answer: "Honda Winner X" },
      { question: "Cung hoàng đạo", answer: "Kim Ngưu" },
      { question: "Câu cửa miệng khi deadline dí", answer: "Ai vừa push code lên main thế?!" },
      { question: "Thể loại phim hay xem", answer: "Phim siêu anh hùng Marvel" },
      { question: "Ca sĩ / Ban nhạc hay nghe", answer: "Ngọt Band" },
      { question: "Một điều ít ai biết về bạn", answer: "Là game thủ cày rank Cao Thủ LMHT" },
      { question: "Ước muốn lớn nhất mùa Noel", answer: "Được thưởng Tết sớm để về quê ăn Tết" }
    ],
    hasViewed: false,
    createdAt: new Date().toISOString()
  }
];
