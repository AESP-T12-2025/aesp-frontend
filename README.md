<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

<h1 align="center">🎓 AESP Frontend</h1>
<h3 align="center">AI-Supported English Speaking Practice Platform</h3>

<p align="center">
  <strong>Giao diện người dùng cho nền tảng luyện nói tiếng Anh thông minh</strong>
</p>

---

## 📖 Giới thiệu

**AESP Frontend** là ứng dụng web được xây dựng bằng **Next.js 16** và **React 19**, cung cấp giao diện người dùng hiện đại cho nền tảng luyện nói tiếng Anh. Ứng dụng hỗ trợ ba loại người dùng: **Learner**, **Mentor**, và **Admin**.

### ✨ Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🎯 **Học viên (Learner)** | Luyện nói theo chủ đề, xem từ vựng, practice với AI |
| 👨‍🏫 **Mentor** | Quản lý học viên, đánh giá bài nói |
| ⚙️ **Admin Dashboard** | Quản lý users, topics, scenarios, content |
| 🌙 **Dark Mode** | Giao diện tối cho trải nghiệm tốt hơn |
| 📱 **Responsive** | Tương thích mọi kích thước màn hình |
| 🔐 **Authentication** | Đăng nhập/Đăng ký với JWT |

---

## 🗂️ Cấu trúc dự án

```
aesp-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Trang Admin Dashboard
│   │   │   ├── dashboard/      # Trang tổng quan
│   │   │   ├── users/          # Quản lý users
│   │   │   ├── topics/         # Quản lý topics
│   │   │   └── scenarios/      # Quản lý scenarios
│   │   ├── learner/            # Trang cho học viên
│   │   ├── auth/               # Đăng nhập, đăng ký
│   │   └── profile/            # Trang cá nhân
│   ├── components/             # Reusable components
│   ├── services/               # API service functions
│   ├── context/                # React Context (Auth, Theme)
│   └── lib/                    # Utilities, helpers
├── public/                     # Static assets
├── package.json               # Dependencies
└── tailwind.config.js         # Tailwind configuration
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

- **Node.js** 18+ (hoặc sử dụng nodeenv)
- **npm** hoặc **yarn**

### Bước 1: Clone repository

```bash
git clone https://github.com/AESP-T12-2025/aesp-frontend.git
cd aesp-frontend
```

### Bước 2: Cài đặt dependencies

**Cách 1: Sử dụng Node.js global**
```bash
npm install
```

**Cách 2: Sử dụng nodeenv (Khuyến nghị)**
```bash
# Cài nodeenv
pip install nodeenv

# Tạo môi trường Node.js riêng
python -m nodeenv env

# Kích hoạt môi trường (Windows PowerShell)
.\env\Scripts\Activate.ps1

# Kích hoạt môi trường (macOS/Linux)
source env/bin/activate

# Cài đặt packages
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Production API
# NEXT_PUBLIC_API_URL=https://aesp-backend.onrender.com
```

### Bước 4: Khởi động development server

```bash
npm run dev
```

🌐 Ứng dụng chạy tại: `http://localhost:3000`

---

## 📜 Scripts

| Command | Mô tả |
|---------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra linting |

---

## 🎨 Giao diện

### Admin Dashboard
- **Dashboard**: Thống kê tổng quan
- **Users**: Quản lý tài khoản người dùng
- **Topics**: Thêm/Sửa/Xóa chủ đề học
- **Scenarios**: Quản lý bài học theo chủ đề

### Learner Portal
- **Topics**: Duyệt các chủ đề học
- **Practice**: Luyện nói với AI
- **Profile**: Cập nhật thông tin cá nhân
- **Community**: Tương tác với cộng đồng

---

## 🔧 Tech Stack

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Next.js** | 16.1 | React framework |
| **React** | 19.2 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **Axios** | 1.13 | HTTP client |
| **Lucide React** | - | Icons |
| **React Hot Toast** | - | Notifications |

---

## 🚢 Deployment

Frontend được deploy trên **Vercel**:

🔗 Production URL: `https://aesp-frontend.vercel.app`

---

## 📝 Quy tắc Git

```bash
# Tạo branch mới
git checkout -b feature/ten-tinh-nang

# Commit với message rõ ràng
git commit -m "feat: mô tả tính năng"

# Push lên remote
git push origin feature/ten-tinh-nang

# Tạo Pull Request để merge vào main
```

### Commit Convention
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật documentation
- `style:` - Format code
- `refactor:` - Refactor code
- `test:` - Thêm tests

---

## 👥 Team

| Thành viên | Vai trò |
|------------|---------|
| **Bùi Quang Long** | Team Leader |

---

## 📄 License

Dự án này được phát triển cho mục đích học tập tại **UTH - Đại học Giao thông Vận tải TP.HCM**.

---

<p align="center">
  <sub>Made with ❤️ by AESP Team</sub>
</p>
