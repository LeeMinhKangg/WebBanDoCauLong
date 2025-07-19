# 🚀 Hướng Dẫn Cài Đặt Website Bán Hàng Mini

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: v18.0.0 trở lên
- **PostgreSQL**: v12.0 trở lên
- **npm**: v8.0.0 trở lên
- **Git**: Bất kỳ phiên bản nào

## 🔧 Cài Đặt Frontend

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình môi trường

```bash
# Sao chép file .env.example thành .env
cp .env.example .env
```

Mở file `.env` và cấu hình:

```env
VITE_API_URL=http://localhost:8888/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Khởi động frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 🔧 Cài Đặt Backend

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

```bash
# Sao chép file .env.example thành .env
cp .env.example .env
```

Mở file `.env` và cấu hình:

```env
# Server Configuration
PORT=8888
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=websitebanhangmini
DB_USER=postgres
DB_PASSWORD=1299

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Gemini AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Khởi động backend

```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:8888

## 🗄️ Cài Đặt PostgreSQL Database

### 1. Tạo database

```sql
-- Mở PostgreSQL console
psql -U postgres

-- Tạo database
CREATE DATABASE websitebanhangmini;

-- Tạo user (nếu chưa có)
CREATE USER postgres WITH PASSWORD '1299';

-- Cấp quyền
GRANT ALL PRIVILEGES ON DATABASE websitebanhangmini TO postgres;

-- Thoát
\q
```

### 2. Chạy migration

```bash
cd backend
npm run db:migrate
```

## 🌱 Seed Data

### 1. Seed Data Hybrid Products

```bash
cd backend
node scripts/import-hybrid-products.js
```

Dữ liệu được tạo:

- 7 danh mục sản phẩm
- 9 sản phẩm với variants (50+ variants)
- Hình ảnh chất lượng cao
- Dữ liệu SEO đầy đủ

### 2. Seed Data Admin

```bash
cd backend
node scripts/seed-database.js
```

Thông tin tài khoản admin:

- **Email**: admin@example.com
- **Password**: admin123

## 🤖 Cấu Hình Gemini AI

### 1. Lấy API Key Gemini

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập Google account
3. Click "Create API Key"
4. Copy API key

### 2. Cấu hình API Key

- **Frontend**: Thêm vào file `frontend/.env`

  ```
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```

- **Backend**: Thêm vào file `backend/.env`
  ```
  GEMINI_API_KEY=your_gemini_api_key_here
  ```

### 3. Kiểm tra hoạt động

- Truy cập website và mở chatbot ở góc phải dưới
- Nếu thấy dot màu xanh "Gemini AI Active", AI đã hoạt động
- Nếu thấy dot màu vàng "Demo Mode", cần kiểm tra lại API key

## 🔍 Kiểm Tra Cài Đặt

1. Truy cập frontend: http://localhost:5173
2. Truy cập admin panel: http://localhost:5173/admin
   - Đăng nhập với tài khoản admin đã tạo
3. Kiểm tra API: http://localhost:8888/api/health

## 🆘 Xử Lý Sự Cố

### Lỗi kết nối database

```bash
# Kiểm tra PostgreSQL đang chạy
sudo service postgresql status

# Kiểm tra thông tin kết nối trong .env
```

### Lỗi port đã được sử dụng

```bash
# Tìm process đang dùng port
lsof -i :8888

# Kill process
kill -9 <PID>
```

### Lỗi dependencies

```bash
# Xóa node_modules và install lại
rm -rf node_modules
npm install
```

## 📞 Hỗ Trợ

- Email: dunglvdeveloper@gmail.com
- Telegram: @dungvietle
