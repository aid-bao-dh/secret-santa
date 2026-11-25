# 🎄 Secret Santa 2026 - Dự Án Trao Quà Giáng Sinh Công Ty 🎅

Dự án web ứng dụng dành cho sự kiện **Secret Santa** nội bộ công ty, xây dựng trên nền tảng **Next.js (App Router)**, **Tailwind CSS**, và hỗ trợ **MongoDB** (kèm chế độ lưu file JSON dự phòng thông minh).

---

## 🌟 Tính Năng Nổi Bật

1. **Giao diện Giáng sinh lung linh:**
   - Hiệu ứng tuyết rơi nhẹ nhàng, tone màu đỏ Noel + xanh thông ấm cúng.
   - Đồng hồ đếm ngược (Countdown) đến ngày 27/11 (giờ bóc Santa) hoặc ngày diễn ra sự kiện.
   - Khung thể lệ / Luật chơi có sẵn (Placeholder sẵn sàng cập nhật).

2. **Cơ chế Bảo mật & Định danh (Email + 4 số cuối điện thoại):**
   - Nhân viên chỉ cần nhập **Email công ty** + **4 số cuối SĐT** (khóa bảo mật chống người khác tò mò xem hộ).
   - Backend chỉ trả về đúng 2 thông tin bảo mật:
     - Full profile + ảnh + wishlist của **người mình sẽ tặng**.
     - **3 gợi ý bí mật (hints)** của Santa tặng mình (danh tính, avatar và phòng ban của Santa được giấu kín 100%).

3. **Thuật toán Ghép Cặp (Auto Matching):**
   - Đảm bảo **Không cùng bộ phận** ($Dept(A) \neq Dept(B)$).
   - Chu trình kín $1 \leftrightarrow 1$, không ai tự tặng cho chính mình.
   - Tự động bốc **3 câu hỏi/trả lời ngẫu nhiên** từ 10 câu hỏi sở thích của Santa và **khóa cố định** vào database (tránh F5 đổi câu hỏi).

4. **Trang Quản Trị Bí Mật (`/admin`):**
   - Khóa bằng **Master Password** (mặc định: `admin123`).
   - Nút **"Nạp Data Demo Mẫu"**: 1-click có ngay 6 nhân sự mẫu (Linh, Bảo, Nhi, Khoa, Hà, Dũng) để test thử flow.
   - Nút **"Chạy Thuật Toán Ghép Cặp"** (1-click tính toán và khóa danh sách).
   - Nút **"Xuất File Excel Kết Quả"** để BTC lưu trữ offline.
   - Hỗ trợ **Import file Excel/CSV** hoặc tải **File mẫu Excel (Template)**.
   - Quản lý trạng thái: Ai đã mở xem thẻ quà, ai chưa mở.

5. **🎪 Vòng Quay Thăm Hình Phạt (`/penalty`):**
   - Thiết kế riêng cho mục số 5 trong kế hoạch của **Nhi**.
   - Chiếu lên máy chiếu trong buổi tiệc Giáng sinh để quay phạt ai quên chuẩn bị quà hoặc đoán sai danh tính Santa.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi chạy Development Server
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 2. Truy cập Trang Quản Trị
Đường dẫn: [http://localhost:3000/admin](http://localhost:3000/admin)  
Mật khẩu mặc định: `admin123` *(có thể thay đổi trong `.env.local`)*

---

## 🗄️ Cấu Hình Database (MongoDB & Local Fallback)

Hệ thống được thiết kế **linh hoạt tối đa**:
- **Chưa có MongoDB ngay lúc này?**  
  Hệ thống tự động sử dụng kho dữ liệu cục bộ an toàn tại `data/secret_santa.json`. Bạn có thể test, import Excel, và chạy matching bình thường mà không cần cấu hình gì thêm.
- **Khi muốn kết nối MongoDB Atlas / Server:**  
  Mở file `.env.local` và điền chuỗi kết nối:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/secret_santa?retryWrites=true&w=majority
  ADMIN_PASSWORD=mat_khau_cua_ban
  ```
  Hệ thống sẽ tự động chuyển sang lưu trữ trên MongoDB mà không cần thay đổi bất kỳ dòng code nào!

---

## 📅 Lộ Trình Phối Hợp (Khớp với kế hoạch của Linh + Bảo + Nhi)

| Thời gian | Công việc | Phụ trách |
|---|---|---|
| **24/11 - 25/11** | Thu thập data (Email, 4 số cuối SĐT, ảnh, phòng ban, 10 câu hỏi sở thích, wishlist) | Linh + Bảo + Nhi |
| **26/11** | Vào trang `/admin`, tải file mẫu Excel, điền thông tin và bấm **Import File Excel**. Bấm **Chạy Thuật Toán Ghép Cặp** | Bạn (Admin) |
| **27/11** | Gửi link trang chủ cho toàn thể công ty. Mọi người nhập email + 4 số cuối ĐT để bóc thẻ nhiệm vụ | Toàn bộ nhân viên |
| **Tiệc Noel** | Bật màn hình máy chiếu trang `/penalty` để quay Thăm hình phạt vui nhộn | Nhi |
