# AESP Frontend

> Giao diện người dùng cho nền tảng luyện nói tiếng Anh với AI - Next.js 16 + React 19 + Tailwind CSS 4

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

---

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/AESP-T12-2025/aesp-frontend.git
cd aesp-frontend
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit: NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Run development server
npm run dev
```

🌐 App: http://localhost:3000

---

## Features

| Portal | Features |
|--------|----------|
| 🎯 **Learner** | Topics, Scenarios, AI Practice, Peer Matching, Vocabulary, Progress Reports |
| 👨‍🏫 **Mentor** | Schedule Slots, Student Management, Assessments, Resources, Reviews |
| ⚙️ **Admin** | User Management, Content CRUD, Analytics Dashboard, Reports, Policies |

### Common Features
- 🔐 JWT + OAuth Google Authentication
- 🌙 Dark/Light Mode
- 📱 Fully Responsive
- 🔔 Real-time Notifications
- 💳 Subscription Payments

---

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

---

## Project Structure

```
aesp-frontend/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/          # Admin dashboard (16 pages)
│   │   ├── learner/        # Learner portal (22 pages)
│   │   ├── mentor/         # Mentor portal (11 pages)
│   │   ├── login/          # Authentication
│   │   ├── register/
│   │   ├── profile/
│   │   └── policies/
│   ├── components/         # Reusable UI components
│   ├── services/           # API service layer (23 services)
│   ├── context/            # React Context (Auth)
│   ├── lib/                # Utilities
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── package.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint check |

---

## API Services

Frontend integrates with backend through 23 service modules:

| Service | Description |
|---------|-------------|
| `authService` | Login, register, OAuth |
| `learnerService` | Learning paths, progress |
| `mentorService` | Slots, bookings, students |
| `adminService` | User & content management |
| `aiService` | Chat, TTS, speech analysis |
| `contentService` | Categories, topics, scenarios |
| `proficiencyService` | Placement tests |
| `peerService` | Peer matching |
| `analyticsService` | Reports, stats |
| `notificationService` | Push notifications |
| `paymentService` | Subscriptions |
| `socialService` | Posts, comments |

---

## Deployment

- **Platform**: Vercel
- **Production**: https://aesp-frontend.vercel.app

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1 | React framework |
| React | 19.2 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Axios | 1.13 | HTTP client |
| Lucide React | - | Icons |
| React Hot Toast | - | Notifications |

---

## Git Convention

```bash
# Branch naming
git checkout -b feature/feature-name
git checkout -b fix/bug-name

# Commit messages
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
```

---

## License

Educational project - UTH (University of Transport Ho Chi Minh City)

---

<p align="center">Made with ❤️ by AESP Team</p>
