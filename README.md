# AESP Frontend (Next.js + Admin Dashboard)

Dự án Frontend cho hệ thống AESP, bao gồm trang Learner (đang phát triển) và Admin Dashboard (Week 1).

## Yêu cầu môi trường

-   **KHÔNG CẦN** cài Node.js global (nếu không muốn).
-   Dự án sử dụng `nodeenv` để quản lý môi trường Node.js biệt lập.
-   Yêu cầu: Python (để cài nodeenv).

## Hướng dẫn cài đặt (Cho Developer mới)

### Bước 1: Clone Repository
```bash
git clone https://github.com/AESP-T12-2025/aesp-frontend.git
cd aesp-frontend
```

### Bước 2: Thiết lập môi trường ảo nodeenv
Nếu bạn chưa có thư mục `env`, hãy chạy lệnh sau để tạo (chỉ cần làm 1 lần):
```powershell
# Cài đặt nodeenv (nếu chưa có)
pip install nodeenv

# Tạo môi trường ảo (tương đương Node v20.x)
python -m nodeenv env
```

### Bước 3: Kích hoạt môi trường và Cài đặt thư viện
**Lưu ý:** Luôn phải kích hoạt môi trường trước khi chạy lệnh npm.

```powershell
# Kích hoạt môi trường (Windows PowerShell)
.\env\Scripts\Activate.ps1

# Cài đặt dependencies
npm install
```

### Bước 4: Cấu hình biến môi trường
Tạo file `.env.local` ở thư mục gốc nếu cần chỉnh sửa API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Bước 5: Chạy dự án
```powershell
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

## Cấu trúc dự án
-   `src/app/admin`: Các trang quản trị (Dashboard, Users, Topics, Scenarios).
-   `src/lib/api.ts`: Cấu hình Axios gọi xuống Backend.
-   `src/components`: Các component tái sử dụng.

## Lưu ý Git
-   Luôn tạo branch mới (`feature/...`) khi code.
-   Không push trực tiếp lên `main` hoặc `official`.
