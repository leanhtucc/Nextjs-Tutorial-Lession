# LẬP TRÌNH WEB NÂNG CAO - BÀI TẬP TUẦN 8 (NEXT.JS)

Dự án phát triển trên nền tảng **Next.js 15 (App Router)**, tích hợp xác thực **NextAuth v5 (Auth.js)**, phân quyền 2 vai trò (**Admin / User**) theo mô hình phòng thủ đa lớp (Defense in Depth), tối ưu hoá **SEO Lighthouse 100/100**, và hệ thống cơ sở dữ liệu **PostgreSQL**.

---

## 🎯 4 YÊU CẦU BÀI TẬP & KẾT QUẢ ĐẠT ĐƯỢC

1. **Tích hợp NextAuth v5:**
   - Hỗ trợ đăng nhập Email/Mật khẩu (Credentials) có mã hóa `bcrypt` đối chiếu với PostgreSQL.
   - Hỗ trợ đăng nhập qua OAuth Providers: **GitHub OAuth** và **Google OAuth**.
   - Giao diện có tính năng **⚡ 1-Click Autofill** giúp giảng viên kiểm thử nhanh không cần gõ phím.

2. **Phân quyền 2 vai trò (`admin`, `user`) 4 lớp bảo vệ:**
   - **TypeScript Typing:** Mở rộng kiểu dữ liệu Session, User và JWT trong `types/next-auth.d.ts`.
   - **Lớp 0 (UI Guard):** Ẩn các nút hành động (Tạo, Sửa, Xoá) đối với tài khoản `user`, chỉ hiển thị cho `admin`.
   - **Lớp 1 (Edge Middleware):** `middleware.ts` + `auth.config.ts` chặn URL Admin ngay tại Edge Network trước khi request tới server.
   - **Lớp 2 (Server Component Page):** Kiểm tra `await auth()` tại các trang `create`, `edit` và `admin`. Chuyển hướng người dùng trái phép.
   - **Lớp 3 (Server Actions):** Tại `actions.ts`, kiểm tra quyền Admin trước khi thực thi lệnh ghi/xoá vào PostgreSQL, chống triệt để tấn công bypass UI.

3. **SEO toàn diện cho 2 trang công khai (`/` và `/login`):**
   - **Canonical URLs:** Khai báo thẻ Canonical chống trùng lặp nội dung.
   - **Dynamic OpenGraph Image:** Tự động sinh ảnh kích thước $1200 \times 630\text{ px}$ bằng `ImageResponse` tại `app/opengraph-image.tsx`.
   - **Schema JSON-LD:** Cấu trúc dữ liệu có cấu trúc `SoftwareApplication`, `Organization`, `WebPage`, `BreadcrumbList`.
   - **Sơ đồ trang & Bot:** Cung cấp `robots.ts` và `sitemap.ts`.

4. **Báo cáo ngắn:**
   - Chi tiết tại file **[REPORT.md](./REPORT.md)** (kèm sơ đồ bảo vệ dạng Mermaid và bảng điểm Lighthouse thực nghiệm).

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Thiết lập biến môi trường
Tạo file `.env.local` ở thư mục gốc (tham khảo `.env.example`):
```env
# Kết nối PostgreSQL (Vercel Postgres, Supabase, Neon hoặc Postgres Local)
POSTGRES_URL="postgres://username:password@hostname:5432/database"

# Secret cho NextAuth v5 (tạo ngẫu nhiên bằng lệnh: openssl rand -base64 32)
AUTH_SECRET="your-32-character-secret-key-goes-here"
AUTH_URL="http://localhost:3000/api/auth"

# GitHub OAuth (Tùy chọn cho tính năng đăng nhập GitHub)
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Google OAuth (Tùy chọn cho tính năng đăng nhập Google)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Cấp quyền Admin cho email cá nhân khi đăng nhập OAuth
ADMIN_EMAILS="admin@nextmail.com"
```

### 3. Khởi chạy ứng dụng
```bash
npm run dev
```

### 4. Khởi tạo dữ liệu mẫu (Seed Database)
Mở trình duyệt truy cập địa chỉ:
`http://localhost:3000/seed`
Hệ thống sẽ tự động tạo bảng `users`, `invoices`, `customers`, `revenue` và nạp sẵn 2 tài khoản kiểm thử.

---

## 🧪 TÀI KHOẢN & KỊCH BẢN KIỂM THỬ

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn trong hệ thống |
| :--- | :--- | :---: | :--- |
| **Quản trị viên (Admin)** | `admin@nextmail.com` | `123456` | Toàn quyền: Xem, Tạo, Sửa, Xoá hoá đơn, Truy cập Admin Control Panel (`/dashboard/admin`). |
| **Người dùng (User)** | `user@nextmail.com` | `123456` | Chỉ xem: Xem Dashboard, xem danh sách hoá đơn (các nút Tạo, Sửa, Xoá bị ẩn và khoá). |

### Kịch bản kiểm thử bảo mật 3 lớp:
1. **Kiểm thử Lớp 1 (Middleware):** Đăng nhập với tài khoản `user@nextmail.com`. Sau đó gõ trên thanh địa chỉ URL: `http://localhost:3000/dashboard/admin` $\rightarrow$ Bị chặn ngay lập tức và chuyển hướng sang `/unauthorized`.
2. **Kiểm thử Lớp 2 (Page Guard):** Khi đăng nhập quyền `user`, truy cập thẳng `http://localhost:3000/dashboard/invoices/create` $\rightarrow$ Server Component kiểm tra quyền và điều hướng trở lại `/dashboard/invoices`.
3. **Kiểm thử Lớp 3 (Server Action):** Gửi trực tiếp mutation gọi hàm `deleteInvoice` $\rightarrow$ Ném lỗi `403 Forbidden`, bảo vệ cơ sở dữ liệu toàn vẹn.
