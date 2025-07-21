# 📚 Tài Liệu Hướng Dẫn Website Bán Đồ Cầu Lông

## 👋 Giới Thiệu

Chào mừng bạn đến với tài liệu hướng dẫn cho **Website Bán Đồ Cầu Lông**! Đây là bộ source code e-commerce hoàn chỉnh, được xây dựng với các công nghệ hiện đại nhất, giúp bạn nhanh chóng triển khai một website bán hàng chuyên nghiệp.

## 📋 Nội Dung

Tài liệu này bao gồm các hướng dẫn chi tiết để giúp bạn cài đặt, cấu hình và sử dụng Website Bán Đồ Cầu Lông:

1. [Hướng Dẫn Cài Đặt](./INSTALLATION_GUIDE.md) - Cài đặt frontend, backend và database
2. [Cấu Trúc Dự Án](./PROJECT_STRUCTURE.md) - Mô tả chi tiết cấu trúc thư mục và files
3. [Luồng Hoạt Động](./PROJECT_FLOW.md) - Giải thích luồng hoạt động của dự án

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống

- **Node.js**: v18.0.0 trở lên
- **PostgreSQL**: v12.0 trở lên
- **npm**: v8.0.0 trở lên

### Cài Đặt Nhanh

```bash
# Clone repository (nếu chưa có)
git clone [repository-url]
cd websitebanhangmini

# Cài đặt dependencies
cd backend && npm install
cd ../frontend && npm install

# Cấu hình database
# Tạo database PostgreSQL với tên "websitebanhangmini"

# Chạy migrations và seed data
cd ../backend
npm run db:migrate
node scripts/import-hybrid-products.js

# Khởi động servers
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
```

Truy cập:

- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- Backend API: http://localhost:8888

## 🔑 Tính Năng Chính

### 🛍️ E-commerce Core

- ✅ Catalog sản phẩm với phân trang và filtering
- ✅ Chi tiết sản phẩm với variants và gallery
- ✅ Giỏ hàng và wishlist
- ✅ Checkout với Stripe
- ✅ Quản lý đơn hàng
- ✅ Đánh giá sản phẩm

### 👥 User Management

- ✅ Đăng ký/đăng nhập
- ✅ Profile người dùng
- ✅ Lịch sử đơn hàng
- ✅ Quản lý địa chỉ

### 👨‍💼 Admin Panel

- ✅ Dashboard thống kê
- ✅ Quản lý sản phẩm
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Báo cáo bán hàng

### 🤖 AI Features

- ✅ Chatbot Gemini AI
- ✅ Gợi ý sản phẩm
- ✅ Tìm kiếm thông minh

## 📋 Hướng Dẫn Cài Đặt Chi Tiết

### 1. Cài Đặt PostgreSQL

Xem hướng dẫn chi tiết trong [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#🗄️-cài-đặt-postgresql-database).

### 2. Seed Data

Xem hướng dẫn chi tiết trong [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#🌱-seed-data).

### 3. Cấu Hình Gemini AI

Xem hướng dẫn chi tiết trong [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#🤖-cấu-hình-gemini-ai).

## 🏗️ Cấu Trúc Dự Án

Xem mô tả chi tiết cấu trúc dự án trong [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## 🔄 Luồng Hoạt Động

Xem giải thích chi tiết về luồng hoạt động của dự án trong [PROJECT_FLOW.md](./PROJECT_FLOW.md).

## 🛠️ Tùy Chỉnh

### Thay Đổi Thương Hiệu

1. **Logo & Branding**

   - Thay đổi logo trong `frontend/public/images/`
   - Cập nhật màu sắc trong `frontend/tailwind.config.js`

2. **Tên Website**
   - Cập nhật trong `frontend/src/constants/app.js`
   - Thay đổi meta tags

### Cấu Hình Thanh Toán

```env
# Trong file backend/.env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 🚀 Triển Khai Production

### Build Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run start
```

### Deploy Options

- **VPS**: Ubuntu, CentOS, Debian
- **Cloud**: AWS, Google Cloud, Azure
- **Hosting**: Vercel, Netlify, Heroku

## 🆘 Xử Lý Sự Cố

Xem hướng dẫn xử lý sự cố trong [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md#🆘-xử-lý-sự-cố).

## 📞 Hỗ Trợ

- Email: leeminhkang@gmail.com
- FaceBook: LE Minh Khang(kang)

---

_© 2025 Website Bán Đồ Cầu Lông - Giải pháp e-commerce toàn diện_
