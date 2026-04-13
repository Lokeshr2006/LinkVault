# 🔗 LinkVault — URL Shortener with Analytics

> A production-ready, full-stack URL Shortener platform with real-time analytics, QR code generation, geographic tracking, and bulk URL processing. Built for the Katomaran Hackathon 2026.

![LinkVault](https://img.shields.io/badge/LinkVault-URL%20Shortener-FFD700?style=for-the-badge&logo=link&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://linkvault-sandy.vercel.app |
| **Backend API** | https://linkvault-production-a4ea.up.railway.app |
| **Health Check** | https://linkvault-production-a4ea.up.railway.app/health |

---

## 🎥 Demo Video

> 📹 [Watch the Demo on Loom](https://www.loom.com/share/70177ead1b194ff99b04c1f7c2d3e2fd)


---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [AI Planning Document](#ai-planning-document)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Assumptions](#assumptions)
- [Sample Output](#sample-output)
- [UI Libraries Used](#ui-libraries-used)

---

## ✨ Features

### Mandatory Features
- ✅ **User Authentication** — Signup and login with JWT tokens
- ✅ **Password Hashing** — bcrypt with 12 salt rounds
- ✅ **Protected Routes** — Dashboard only accessible to authenticated users
- ✅ **User Isolation** — Each user only manages their own shortened URLs
- ✅ **URL Shortening** — Generate unique 7-character short codes using nanoid
- ✅ **Unique Short Codes** — Collision detection ensures uniqueness
- ✅ **Server-side Redirect** — Backend handles redirect and logs click
- ✅ **URL Validation** — Input validated before shortening (client + server)
- ✅ **Dashboard** — View all created short URLs
- ✅ **Show Original URL** — Full original URL displayed
- ✅ **Show Short URL** — Shortened URL displayed
- ✅ **Show Created Date** — Creation timestamp shown
- ✅ **Show Total Clicks** — Click count per URL
- ✅ **Delete URL** — Remove shortened URLs
- ✅ **Copy Short URL** — One-click clipboard copy
- ✅ **Click Count** — Track number of clicks per short URL
- ✅ **Visit Timestamps** — Record timestamp of each visit
- ✅ **Analytics Page** — Detailed per-link analytics
- ✅ **Total Click Count** — Aggregated click statistics
- ✅ **Last Visited Time** — Most recent visit timestamp
- ✅ **Recent Visit History** — Table with device, browser, country
- ✅ **Responsive UI** — Works on mobile, tablet, and desktop
- ✅ **Clean Dashboard** — Neo-brutalism design with bento grid layout
- ✅ **Loading States** — Spinners for all async operations
- ✅ **Success States** — Toast notifications for all actions
- ✅ **Error States** — Proper error messages displayed
- ✅ **Form Validation Messages** — Client and server validation feedback

### Bonus Features
- ✅ **Custom Alias** — Personalized short URLs 
- ✅ **QR Code Generation** — Downloadable QR codes for every link
- ✅ **Expiry Date** — Links automatically expire after set date
- ✅ **Geolocation Analytics** — Country-level tracking via IP
- ✅ **Device Analytics** — Mobile/Desktop/Tablet breakdown
- ✅ **Browser Analytics** — Chrome/Safari/Firefox tracking
- ✅ **Daily Click Trends** — Area chart showing clicks over time
- ✅ **Public Stats Page** — Shareable analytics page without login
- ✅ **Edit Destination URL** — Update original URL for existing links
- ✅ **Bulk URL Shortening via CSV** — Upload CSV to shorten multiple URLs at once
- ✅ **Deployment with Live Demo** — Railway (backend) + Vercel (frontend)
- ✅ **Docker Containerization** — Full Docker + docker-compose setup
- ✅ **CI/CD Pipeline** — GitHub Actions for automated testing

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI framework |
| **Styling** | TailwindCSS v3 | Utility-first CSS |
| **Charts** | Recharts | Analytics visualization |
| **QR Code** | qrcode.react 3.x | QR code generation (QRCodeCanvas) |
| **HTTP Client** | Axios | API calls |
| **Routing** | React Router v6 | Client-side routing |
| **Notifications** | react-hot-toast | Toast notifications |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | PostgreSQL 15 | Relational data storage |
| **ORM** | Prisma v5 | Database client |
| **Authentication** | JWT + bcryptjs | Auth tokens + password hashing |
| **Short Code** | nanoid v3 | Unique ID generation |
| **Device Detection** | ua-parser-js | User agent parsing |
| **Security** | Helmet.js | HTTP security headers |
| **Rate Limiting** | express-rate-limit | API protection |
| **Validation** | express-validator | Input validation |
| **Containerization** | Docker + nginx | Container runtime |
| **CI/CD** | GitHub Actions | Automated pipeline |
| **Deploy Backend** | Railway | Backend hosting |
| **Deploy Frontend** | Vercel | Frontend hosting |

---

## 🤖 AI Planning Document

### Planning Process

#### Step 1 — Requirements Analysis
Analyzed the hackathon problem statement and broke it into:
- Core features (must have)
- Bonus features (nice to have)
- Tech constraints (must follow)

#### Step 2 — Architecture Decision
```
Decision: PostgreSQL over MongoDB
Reason: Analytics data is highly relational 
        PostgreSQL GROUP BY and aggregations are perfect for analytics

Decision: Prisma ORM
Reason: Type-safe queries, easy migrations, excellent PostgreSQL support

Decision: nanoid for short codes
Reason: URL-safe characters, configurable length, cryptographically secure
        7 chars = 58^7 = 3.5 trillion combinations

Decision: JWT over sessions
Reason: Stateless, works well with separate frontend/backend repos

Decision: Fire-and-forget click logging
Reason: Don't block redirect on analytics write
        User gets redirected instantly, analytics saves in background
```

#### Step 3 — Feature Planning
Listed all features with priority:
1. Auth (register/login) — P0
2. URL shortening — P0
3. Redirect + click tracking — P0
4. Dashboard — P0
5. Analytics — P0
6. Custom alias — P1
7. QR code — P1
8. Expiry dates — P1
9. Public stats — P1
10. Bulk CSV — P2
11. Docker — P2
12. CI/CD — P2

#### Step 4 — UI Design
Used **Gemini and Claude AI** to generate 7 page designs:
- Login, Register, Dashboard, Analytics, Settings, Public Stats, QR Modal
- Design system: Neo-brutalism with yellow (#FFD700) primary color
- Font: Plus Jakarta Sans
- Components converted from HTML/Tailwind to React

#### Step 5 — Development Phases
- Phase 1: Backend setup (Express, Prisma, PostgreSQL)
- Phase 2: Auth APIs (register, login, JWT)
- Phase 3: URL APIs (CRUD, redirect, click tracking)
- Phase 4: Analytics APIs (aggregations, daily trends)
- Phase 5: Frontend (React pages, API integration)
- Phase 6: Docker + CI/CD
- Phase 7: Deployment (Railway + Vercel)

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Frontend (Vercel)                     │  │
│  │                                                       │  │
│  │  Login │ Register │ Dashboard │ Analytics             │  │
│  │  Settings │ Public Stats │ QR Modal │ Bulk CSV        │  │
│  │                                                       │  │
│  │  AuthContext │ React Router │ Axios │ Recharts        │  │
│  └──────────────────────┬────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTPS REST API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                EXPRESS.JS BACKEND (Railway)                 │
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────────┐     │
│  │   Auth    │  │   URLs    │  │      Analytics       │     │
│  │  Routes   │  │  Routes   │  │       Routes         │     │
│  │           │  │           │  │                      │     │
│  │ /register │  │ POST /urls│  │ GET /:id/analytics   │     │
│  │ /login    │  │ GET /urls │  │ GET /public/:code    │     │
│  │ /me       │  │ DELETE    │  │                      │     │
│  │ /profile  │  │ /bulk     │  │                      │     │
│  └───────────┘  └───────────┘  └──────────────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Middleware Layer                    │    │
│  │  JWT Auth │ Rate Limiter │ CORS │ Helmet │ Validator│    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Prisma ORM                        │    │
│  └──────────────────────┬──────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                        │
│                                                             │
│  ┌──────────┐      ┌────────────────┐    ┌─────────────┐    │
│  │   User   │      │      Url       │    │    Click    │    │
│  │──────────│      │────────────────│    │─────────────│    │
│  │ id       │─────▶│ id             │───▶│ id         │    │
│  │ name     │      │ userId         │    │ urlId       │    │
│  │ email    │      │ originalUrl    │    │ timestamp   │    │
│  │ password │      │ shortCode      │    │ device      │    │
│  │ createdAt│      │ customAlias    │    │ browser     │    │
│  └──────────┘      │ expiresAt      │    │ country     │    │
│                    │ createdAt      │    │ ip          │    │
│                    └────────────────┘    └─────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Redirect Flow
```
User visits https://linkvault-sandy.vercel.app/praneet
        │
        ▼
React Router matches /:shortCode → Redirect.jsx
        │
        ▼
GET /api/urls/redirect/praneet (backend)
        │
        ▼
Find URL in DB → Check expiry date
        │
        ▼
Log Click: device + browser + country + IP + timestamp
(fired asynchronously — does not block redirect)
        │
        ▼
Return { originalUrl } to frontend
        │
        ▼
window.location.href = originalUrl (browser redirects)
```

### Docker Architecture
```
docker-compose up
        │
        ├── postgres:5432 (PostgreSQL container)
        │       └── Volume: postgres_data
        │       └── Healthcheck: pg_isready every 5s
        │
        ├── backend:5000 (Node.js container)
        │       ├── depends_on: postgres (service_healthy)
        │       └── runs: prisma db push && npm start
        │
        └── frontend:80 (nginx container)
                ├── depends_on: backend
                └── serves: React build + try_files fallback
```

### CI/CD Pipeline
```
git push → GitHub Actions triggered
        │
        ├── Backend CI (Node 20)
        │       ├── Install dependencies
        │       └── Validate Prisma schema
        │
        ├── Frontend CI (Node 20)
        │       ├── Install dependencies
        │       └── Build production bundle
        │
        └── Docker Build Test
                ├── needs: [backend-test, frontend-test]
                ├── Build all images
                └── Verify compose works
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v20+
- PostgreSQL 15+
- Git
- Docker Desktop 

### Option 1 — Local Development

#### 1. Clone the repository
```bash
git clone https://github.com/PraneetAR/linkvault.git
cd linkvault
```

#### 2. Backend Setup
```bash
cd linkvault-backend
npm install
```

Create `linkvault-backend/.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/linkvault"
JWT_SECRET="linkvault_super_secret_jwt_key_2024"
JWT_EXPIRES_IN="7d"
PORT=5000
CLIENT_URL="http://localhost:5173"
BASE_URL="http://localhost:5173"
NODE_ENV="development"
```
```bash
npx prisma db push
npx prisma generate
npm run dev
```

#### 3. Frontend Setup
```bash
cd linkvault-frontend
npm install
```

Create `linkvault-frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

#### 4. Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

---

## 🐳 Docker Setup

### Run entire app with ONE command:
```bash
git clone https://github.com/PraneetAR/linkvault.git
cd linkvault
docker-compose up --build
```

Visit: **http://localhost**

### Stop:
```bash
docker-compose down
```

### Production:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## 🔐 Environment Variables

### Backend (`linkvault-backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `BASE_URL` | Base URL for short links | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` or `production` |

### Frontend (`linkvault-frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📡 API Documentation

### Base URL
```
Local:      http://localhost:5000/api
Production: https://linkvault-production-a4ea.up.railway.app/api
```

### Authentication Endpoints

#### POST `/api/auth/register`
```json
Request:
{
  "name": "Praneet AR",
  "email": "praneet@example.com",
  "password": "password123"
}

Response:
{
  "message": "Account created successfully",
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Praneet AR", "email": "..." }
}
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "praneet@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Praneet AR", "email": "..." }
}
```

### URL Endpoints

#### POST `/api/urls` (Protected)
```json
Request:
{
  "originalUrl": "https://google.com",
  "customAlias": "google",
  "expiresAt": "2026-12-31T00:00:00Z"
}

Response:
{
  "message": "Short URL created successfully",
  "url": {
    "id": "...",
    "shortCode": "FT3dyDi",
    "shortUrl": "https://linkvault-sandy.vercel.app/google",
    "originalUrl": "https://google.com"
  }
}
```

#### POST `/api/urls/bulk` (Protected)
```json
Request:
{
  "urls": [
    { "originalUrl": "https://google.com", "customAlias": "google" },
    { "originalUrl": "https://youtube.com" }
  ]
}

Response:
{
  "message": "2 URLs shortened successfully",
  "results": [...],
  "errors": [],
  "total": 2,
  "success": 2,
  "failed": 0
}
```

#### GET `/api/urls/dashboard` (Protected)
```json
Response:
{
  "stats": {
    "totalLinks": 10,
    "totalClicks": 245,
    "growth": 15
  },
  "recentUrls": [...]
}
```

### Analytics Endpoints

#### GET `/api/analytics/:id` (Protected)
```json
Response:
{
  "totalClicks": 245,
  "lastVisited": "2026-03-21T10:30:00Z",
  "recentVisits": [...],
  "deviceBreakdown": [...],
  "countryBreakdown": [...],
  "dailyClicks": [
    { "date": "2026-03-21", "clicks": 45 }
  ]
}
```

#### GET `/api/analytics/public/:shortCode`
```json
Response:
{
  "shortCode": "praneet",
  "totalClicks": 245,
  "deviceBreakdown": [...],
  "countryBreakdown": [...],
  "dailyClicks": [...]
}
```

---

## 📊 Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  urls      Url[]
}

model Url {
  id          String    @id @default(cuid())
  originalUrl String
  shortCode   String    @unique
  customAlias String?   @unique
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  clicks      Click[]
}

model Click {
  id        String   @id @default(cuid())
  urlId     String
  url       Url      @relation(fields: [urlId], references: [id], onDelete: Cascade)
  timestamp DateTime @default(now())
  country   String?
  device    String?
  browser   String?
  ip        String?
}
```

---

## 🔒 Security Features

- **bcrypt** password hashing (12 salt rounds)
- **JWT** tokens for stateless authentication (7 day expiry)
- **Helmet.js** sets 14 HTTP security headers
- **CORS** configured for specific allowed origins only
- **Rate limiting** — 100 requests per 15 minutes per IP
- **Input validation** on all endpoints via express-validator
- **Environment variables** for all secrets — never hardcoded
- **Cascade deletes** — deleting a user removes all their URLs and clicks
- **User enumeration prevention** — identical error messages for wrong email and wrong password

---

## 🖼️ UI Libraries Used

| Library | Version | Purpose |
|---|---|---|
| TailwindCSS | v3 | Utility-first CSS framework |
| Recharts | latest | Analytics charts (AreaChart) |
| qrcode.react | 3.x | QR code generation (QRCodeCanvas) |
| react-hot-toast | latest | Toast notifications |
| Material Symbols | Google Fonts | Icons |
| Plus Jakarta Sans | Google Fonts | Typography |

---

## 💡 Assumptions Made

1. **Short code length** — 7 characters chosen (58^7 = 3.5 trillion combinations — virtually no collisions)
2. **Redirect type** — 302 (temporary) used instead of 301 (permanent) so clicks are always tracked (301 gets cached by browser)
3. **Country detection** — Free ip-api.com used (no API key needed, 45 req/min limit — sufficient for demo)
4. **JWT storage** — localStorage used (acceptable for hackathon; production would use httpOnly cookies)
5. **Short URL domain** — Vercel frontend domain used as base URL (custom domain would require purchase)
6. **Expired links** — Return 410 Gone and stop tracking clicks
7. **Custom alias** — Supports letters, numbers, hyphens, underscores (3-20 characters)
8. **Bulk CSV** — Maximum 100 URLs per upload to prevent abuse
9. **Analytics** — Clicks logged asynchronously (fire-and-forget) to not slow down redirects
10. **Free tier** — Railway and Vercel free tiers used for deployment
11. **Desktop default** — Device type defaults to desktop when User-Agent doesn't specify (desktop browsers don't include device type)
12. **Error messages** — Both wrong email and wrong password return identical messages to prevent user enumeration

---

## 📸 Sample Output

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3b730b95-d38d-4679-bc8a-c113be64a39b" />
<img width="1914" height="1079" alt="image" src="https://github.com/user-attachments/assets/669e6354-3583-4f39-82fe-4adf1e7a5d3b" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/4b9538ff-68f8-42e5-852e-a59f1a729307" />
<img width="1911" height="1079" alt="image" src="https://github.com/user-attachments/assets/365a61c9-99f2-40b9-ba14-dbb3fc9d9db0" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/9f622901-bc18-4a05-b775-64c097051a18" />
<img width="1914" height="1079" alt="image" src="https://github.com/user-attachments/assets/f152c696-a406-4afb-9b5e-cc20cf0d7a4b" />




### Backend Logs
```
🔗 LinkVault API running on http://localhost:5000
POST /api/auth/register 201 45.231 ms
POST /api/auth/login 200 32.112 ms
POST /api/urls 201 12.453 ms
GET /api/urls/redirect/praneet 200 8.234 ms
GET /api/analytics/abc123 200 15.678 ms
```

### Database Entries

**Users table:**
```
id           | name       | email               | createdAt
-------------|------------|---------------------|--------------------
cuid_abc123  | Praneet AR | praneet@example.com | 2026-03-21 10:00
```

**Urls table:**
```
id           | shortCode | customAlias | originalUrl        | createdAt
-------------|-----------|-------------|--------------------|-----------------
cuid_def456  | FT3dyDi   | praneet     | https://google.com | 2026-03-21 10:00
```

**Clicks table:**
```
id           | urlId       | timestamp           | device  | browser | country | ip
-------------|-------------|---------------------|---------|---------|---------|----------------
cuid_ghi789  | cuid_def456 | 2026-03-21 10:30:00 | desktop | Chrome  | IN      | -------------
```

---

## 🔄 CI/CD Pipeline

GitHub Actions runs on every push to `main`:

1. **Backend CI** — Install deps + validate Prisma schema
2. **Frontend CI** — Install deps + build production bundle
3. **Docker Build** — Build all Docker images (runs only if 1 and 2 pass)


---

## 📁 Project Structure
```
linkvault/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
├── linkvault-backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── url.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── url.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   └── redirect.routes.js
│   │   ├── utils/
│   │   │   ├── jwt.utils.js
│   │   │   ├── nanoid.utils.js
│   │   │   └── prisma.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── linkvault-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── QRModal.jsx
│   │   │   ├── CreateLinkModal.jsx
│   │   │   └── BulkUploadModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── AnalyticsList.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── PublicStats.jsx
│   │   │   └── Redirect.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   └── package.json
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 👤 Author

**Praneet A R**
- GitHub: [@PraneetAR](https://github.com/PraneetAR)
- Project: [LinkVault](https://github.com/PraneetAR/linkvault)
- Live Demo: [DEMO](https://www.loom.com/share/70177ead1b194ff99b04c1f7c2d3e2fd)

---

> This project is a part of a hackathon run by https://katomaran.com
