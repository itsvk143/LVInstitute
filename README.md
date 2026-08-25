# LV Institute — Student Management & Academic Progress Dashboard

A **production-ready, enterprise-grade** full-stack Next.js 15 application for managing 10,000+ students across multiple schools, classes, boards, and countries.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components, API Routes) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI, Lucide Icons, shadcn patterns |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Data Fetching** | TanStack Query v5 |
| **Tables** | TanStack Table v9 |
| **Forms** | React Hook Form + Zod |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (jose — Edge compatible) |
| **Deployment** | Vercel (Serverless) |

---

## 📁 Project Structure

```
tstudentdashboard/
├── app/
│   ├── api/                    # API Route Handlers (backend)
│   │   ├── auth/login/         # JWT login
│   │   ├── auth/logout/        # Logout (clear cookie)
│   │   ├── students/           # Students CRUD + public profile
│   │   ├── dashboard/          # Dashboard stats
│   │   ├── progress/           # Chapter progress
│   │   ├── additional-topics/  # Extra curriculum topics
│   │   └── notices/            # Notice board
│   ├── (auth)/login/           # Admin login page
│   ├── (admin)/                # Protected admin pages
│   │   ├── dashboard/          # Main dashboard with charts
│   │   └── students/           # Student management
│   └── student/[admissionNo]/  # Public student portal (NO AUTH)
├── lib/
│   ├── db.ts                   # MongoDB cached connection (serverless-safe)
│   ├── auth.ts                 # JWT helpers (jose)
│   ├── utils.ts                # Utility functions
│   └── models/                 # Mongoose schemas
│       ├── User.ts             # Admin accounts
│       ├── Student.ts          # Student records
│       ├── Teacher.ts          # Teacher profiles
│       ├── School.ts           # Schools
│       ├── Subject.ts          # Subjects
│       ├── Chapter.ts          # Chapters per subject
│       ├── ChapterProgress.ts  # Per-student chapter tracking
│       ├── AdditionalTopic.ts  # Extra curriculum topics
│       ├── Attendance.ts       # Daily attendance
│       ├── Mark.ts             # Test marks & grades
│       ├── Homework.ts         # Homework tracking
│       ├── Examination.ts      # Exam scheduling
│       ├── Notice.ts           # Notice board
│       ├── ActivityLog.ts      # Audit trail
│       └── Lookup.ts           # Class, Board, Country, Batch, Course
├── components/
│   ├── admin/                  # Admin UI components
│   │   ├── Sidebar.tsx         # Animated collapsible sidebar
│   │   └── TopNav.tsx          # Top navigation
│   ├── public/
│   │   └── PublicStudentPortal.tsx  # Public student dashboard
│   └── providers/              # React context providers
├── scripts/
│   └── seed.ts                 # Database seed script
├── proxy.ts                    # Route protection (Next.js 16 proxy)
└── next.config.ts
```

---

## ⚡ Quick Start

### 1. Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier works)
3. Create a database user
4. Get your connection string

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/lv-institute?retryWrites=true&w=majority
JWT_SECRET=your-very-long-random-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ 1 Admin account (`admin@lvinstitute.com` / `Admin@123`)
- ✅ 10 countries (India, UAE, USA, Singapore, etc.)
- ✅ 4 boards (CBSE, ICSE, State, International)
- ✅ 10 classes (Class 3–12)
- ✅ 4 schools
- ✅ 5 courses (NEET, JEE, Board, Foundation, Olympiad)
- ✅ 4 batches
- ✅ 4 teachers
- ✅ 6 subjects (Math, Physics, Chemistry, Biology, English, SST)
- ✅ 24 chapters across subjects
- ✅ 5 students with full profiles
- ✅ Chapter progress with revisions
- ✅ 9 additional topics
- ✅ 9 marks entries
- ✅ 30 days attendance
- ✅ 4 upcoming exams
- ✅ 5 notices

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Access Points

| URL | Description |
|---|---|
| `http://localhost:3000/login` | Admin login |
| `http://localhost:3000/dashboard` | Admin dashboard |
| `http://localhost:3000/students` | Student management |
| `http://localhost:3000/student/LV-2025-0001` | 🌐 Public portal (Arjun Sharma) |
| `http://localhost:3000/student/LV-2025-0002` | 🌐 Public portal (Priya Nair) |
| `http://localhost:3000/student/LV-2025-0003` | 🌐 Public portal (Zara Ahmed) |

---

## 🔐 Authentication

- **JWT** stored in HTTP-only cookie (7 days)
- **jose** library (Edge-compatible, works in Next.js proxy)
- Admin-only routes protected via `proxy.ts`
- Public student portal requires **no login**

---

## 🌐 Public Student Portal

Each student gets a beautiful public URL:
```
/student/{admissionNumber}
```

**Displays:**
- Student profile (photo, class, school, board, country, teacher)
- Subject-wise chapter progress with completion status
- Chapter-by-chapter table: status, revision, completion date, difficulty
- ✨ **Additional Topics** (extra curriculum beyond syllabus)
- Marks summary with trend chart
- Attendance summary with pie chart
- Upcoming examinations with countdown
- Latest relevant notices

**Never displays:** address, phone, email, parent contact, admin notes

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)

---

## 📊 Database Models (15 collections)

| Collection | Purpose |
|---|---|
| `users` | Admin accounts |
| `students` | Student records with soft delete |
| `teachers` | Teacher profiles |
| `schools` | School/institute branches |
| `classes` | Grade 3–12 |
| `boards` | CBSE, ICSE, State, International |
| `countries` | 10+ countries with flags |
| `batches` | Student batch groupings |
| `courses` | NEET, JEE, Board Prep, etc. |
| `subjects` | Unlimited subjects |
| `chapters` | Per-subject chapters |
| `chapterprogresses` | Per-student completion + revisions |
| `additionaltopics` | Extra curriculum tracking |
| `marks` | Test marks with auto grades |
| `attendances` | Daily attendance |
| `examinations` | Exam scheduling |
| `notices` | Notice board with visibility |
| `activitylogs` | Audit trail |

---

## 🔒 Security Features

- ✅ JWT authentication (HTTP-only cookie)
- ✅ Role-based access control (Admin/Superadmin)
- ✅ Password hashing (bcryptjs, 12 rounds)
- ✅ Input validation (Zod)
- ✅ Soft delete (no permanent data loss)
- ✅ Sensitive fields excluded from public API
- ✅ MongoDB indexes for performance

---

## 📈 Supported Student Categories

- **Classes:** 3 to 12
- **Boards:** CBSE, ICSE, State Board, International
- **Courses:** NEET, JEE, Board Excellence, Foundation, Olympiad
- **Countries:** India, UAE, USA, Canada, Singapore, Qatar, Kuwait, Saudi Arabia, Oman, Bahrain

---

## 🛣️ API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/auth/logout` | No | Clear auth cookie |
| GET | `/api/dashboard` | Admin | Dashboard stats |
| GET | `/api/students` | Admin | List + filter students |
| POST | `/api/students` | Admin | Create student |
| GET | `/api/students/[id]` | Admin | Student detail |
| PUT | `/api/students/[id]` | Admin | Update student |
| DELETE | `/api/students/[id]` | Admin | Soft delete |
| GET | `/api/students/[id]/public` | **None** | Public profile |
| GET | `/api/notices` | No | Public notices |
| POST | `/api/notices` | Admin | Create notice |
| GET | `/api/progress?student=` | No | Chapter progress |
| POST | `/api/progress` | Admin | Upsert progress |
| GET | `/api/additional-topics` | No | Additional topics |
| POST | `/api/additional-topics` | Admin | Add topic |

---

*Built for LV Institute — Empowering Students Beyond Boundaries* 🎓
