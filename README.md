# 💎 Monetra — AI Smart Financial & Expense Intelligence Platform


**Monetra** is a personal expense management and financial intelligence web application. It automates your money tracking with **AI Voice Transcription**, **Smart Receipt Scanning**, **Multi-Currency Conversion**, and **Automated Email Reports**.

**Tags & Topics:** `#fintech` `#expense-tracker` `#ai-finance` `#voice-to-expense` `#receipt-scanner` `#gemini-ai` `#react19` `#vite` `#tailwind-css` `#nestjs` `#drizzle-orm` `#supabase` `#postgresql` `#vercel-ready` `#privacy-first` `#open-source`

---

## 🌟 Key Features

- 🎙️ **Voice-to-Transaction (AI)**: Speak naturally (e.g., *"Spent $35 on grocery shopping at Walmart"*) and AI automatically parses the amount, type, date, and category into a ready transaction draft.
- 🧾 **AI Receipt Scanning**: Upload images of paper receipts and bills; computer vision extracts merchant names, amounts, line items, and transaction dates.
- 💱 **Multi-Currency Engine**: Record expenses in foreign currencies with automatic real-time rate conversion to your base currency.
- 📊 **Dynamic Analytics & Charts**: Interactive spending trends, monthly cashflow summaries, category breakdowns, and net balance.
- 📬 **Automated Email Reports**: Scheduled financial digests (Daily, Weekly, Monthly) delivered directly to your inbox via Resend.
- 🛡️ **Zero Tracking & Privacy-First**: Isolated multi-tenant security with JWT token rotation and bcrypt hashing.
- 📄 **Export to CSV & PDF**: Instant export of transactions in structured CSV or styled PDF reports.
- ⚡ **Vercel Serverless Ready**: Architected for rapid deployment with zero maintenance.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Web App** | React 19, Vite, Tailwind CSS, Redux Toolkit (RTK Query), Lucide Icons, Recharts |
| **Backend REST API** | NestJS 10, Express, TypeScript, Passport JWT |
| **Database & ORM** | PostgreSQL (Supabase / Neon), Drizzle ORM |
| **AI & Media** | Google Gemini AI, UpliftAI Voice Engine, Cloudinary |
| **Transactional Email**| Resend API |
| **Hosting & Cloud** | Vercel (Frontend & Serverless Functions) |

---

## 📁 Project Structure

```
monetra/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind)
│   ├── src/                    # Pages, Redux store, API services, UI components
│   ├── vercel.json             # Vercel deployment configuration
│   └── package.json
│
├── server/                     # Backend API (NestJS + Drizzle ORM)
│   ├── src/                    # API routes, services, database schemas
│   ├── vercel.json             # Serverless configuration & CORS headers
│   └── package.json
│
├── package.json                # Monorepo runner scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: v20+ 
- **npm**: v10+
- **PostgreSQL Database**: Free cloud database from [Supabase](https://supabase.com) or local PostgreSQL

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/imsnippet/monetra.git
cd monetra

# Install all dependencies
npm run install:all
```

### 2. Configure Environment Variables

#### Backend (`server/.env`):
```env
PORT=8000
BASE_PATH=/api
NODE_ENV=development

# Database Connection (Supabase / Local Postgres)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
DIRECT_DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# JWT Authentication
JWT_SECRET=your_super_strong_jwt_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_super_strong_refresh_jwt_secret_key_minimum_32

# Client URL (for CORS)
FRONTEND_ORIGIN=http://localhost:5173

# External Services (Optional for basic local testing)
RESEND_API_KEY=re_your_resend_api_key
RESEND_MAILER_SENDER_VERIFY=onboarding@resend.dev
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

### 3. Run Database Migrations

Push the database tables to your Supabase / Postgres instance:
```bash
npm --prefix server run db:migrate
# or push schema directly:
npm --prefix server run drizzle-kit push
```

### 4. Start Development Servers

Run both servers locally:
```bash
# Terminal 1 - Backend Server (Port 8000)
npm run dev:server

# Terminal 2 - Frontend Client (Port 5173)
npm run dev:client
```
- Web Client: **[http://localhost:5173](http://localhost:5173)**
- API Healthcheck: **[http://localhost:8000/api](http://localhost:8000/api)**

---

## 🌐 Deploying to Vercel (Step-by-Step)

Deploy as **two connected projects on Vercel**:

### Step 1: Deploy Backend API (`/server`)

1. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
2. Under **Root Directory**, click **Edit** and select `server`.
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase **Transaction Pooler** connection string (port 6543).
   - `JWT_SECRET`: Random 32+ character string.
   - `JWT_REFRESH_SECRET`: Random 32+ character string.
   - `FRONTEND_ORIGIN`: Your deployed frontend URL (e.g. `https://your-monetra.vercel.app`).
   - `RESEND_API_KEY`: Your Resend API key for verification and report emails.
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. Click **Deploy**. Note down your deployed backend URL (e.g. `https://your-monetra-api.vercel.app`).

### Step 2: Deploy Frontend Client (`/client`)

1. Go to **[vercel.com/new](https://vercel.com/new)** and import the same repository again.
2. Under **Root Directory**, click **Edit** and select `client`.
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-monetra-api.vercel.app/api`
   - `VITE_GOOGLE_CLIENT_ID`: (Optional) your Google OAuth Client ID.
4. Click **Deploy**.
5. Once your frontend is live, copy its domain URL and ensure `FRONTEND_ORIGIN` in your backend Vercel settings matches it.

---

## 🔒 Private & Personal App Security (Keep It Private to You)

To make this app strictly your personal finance tool so nobody else can access or register:

1. **Option A: Vercel Password Protection (Recommended)**
   - In your Vercel Project Dashboard:
   - Go to **Settings** → **Deployment Protection**.
   - Enable **Password Protection**.
   - Anyone visiting the URL will be prompted for your password before the app is accessible.

2. **Option B: Restrict Signup to Your Personal Email Only**
   - In `server/src/services/auth.service.ts`, set the admin email to your address so that any foreign registration is rejected:
     ```typescript
     const ALLOWED_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "your-email@example.com";
     if (body.email.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
       throw new UnauthorizedException("Registration is private. Only the administrator may create an account.");
     }
     ```

---

## 🛡️ Privacy & Data Guarantee

- **100% Isolated Data**: All transactions, bills, and voice notes belong strictly to your authenticated account.
- **Clean Production Seed**: Zero developer artifacts or pre-filled test accounts.
- **Full Portability**: Export your entire financial history anytime as JSON, CSV, or styled PDF.

---

## ☕ Support Independent Development

If Monetra helps streamline your finances and daily budgeting, support independent development via **USDT (TRC20)**:

- **USDT (TRC20) Address:** `TAneq9f7QbigXjqANj6UxUrW83hm1vGCSV`

---

## 👨‍💻 Developed By

Developed with ❤️ by **imsnippet**.
