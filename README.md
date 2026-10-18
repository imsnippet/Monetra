# 💎 Monetra — AI Smart Financial & Expense Intelligence Platform

[![Vercel Web App](https://img.shields.io/badge/Vercel%20App-monetra--web--two.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://monetra-web-two.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Online-10b981?style=for-the-badge&logo=fastapi)](https://server-olive-six-68.vercel.app/health)

> 🌐 **Live Web App on Vercel:** [https://monetra-web-two.vercel.app/](https://monetra-web-two.vercel.app/)  
> 🔗 **Production Backend API:** [https://server-olive-six-68.vercel.app/api](https://server-olive-six-68.vercel.app/api)

**Monetra** is a personal expense management and financial intelligence web application. It automates expense tracking with **AI Voice Transcription**, **AI Receipt Vision Scanning**, **Multi-Currency Conversion**, **Interactive Savings Goals**, and **Complete Data Backup & Restore**.

---

## 🌟 Application Features

- ⚡ **1-Click Instant Access**: Jump straight into your personal dashboard with a single click. Every browser has an isolated, secure, private workspace with zero friction.
- 🎙️ **AI Voice-to-Transaction**: Speak naturally (e.g. *"Spent $35 on grocery shopping at Walmart"*) and AI automatically parses the amount, type, date, and category into a ready transaction draft.
- 🧾 **AI Vision Receipt Scanning**: Upload images of paper receipts and bills; computer vision extracts merchant names, amounts, line items, and transaction dates.
- 💾 **Dedicated Data & Backup Management**: Export your entire financial history into a single snapshot `.json` file, and restore it with one click anytime with zero vendor lock-in.
- 🎯 **Interactive Savings Goals**: Set target portfolios with visual progress bars, smooth sliding carousels, and chronological deposit contribution timelines.
- 📊 **Dynamic Category Budgets & Analytics**: Monthly spending limits, category allocations, cashflow charts, and visual expense breakdown.
- 🔄 **Recurring Transactions & Subscriptions**: Track repeat expenses, rent, utility bills, and payroll schedules effortlessly.
- 🌓 **Instant Theme Switching**: Toggle seamlessly between crisp Daylight Mode and deep Dark Obsidian theme with instant live auto-apply.
- 🧹 **Authorized Workspace Reset**: A dedicated Danger Zone in Settings allows resetting all transactions, budgets, and goals to a clean, fresh state by typing `CONFIRM`.

---

## 🔑 Required APIs & Zero-Cost Architecture

Monetra is designed to run completely free:

| Service | Purpose | Where to Get | Pricing |
| :--- | :--- | :--- | :--- |
| **Neon PostgreSQL** | Serverless Cloud Database | [neon.tech](https://neon.tech) | 100% Free |
| **Native Web Speech API** | Free Real-Time Speech-to-Text | Built into Browser | 100% Free (No API Key Required) |
| **OpenAI / Gemini** *(Optional)* | AI Receipt Vision & Classification | [platform.openai.com](https://platform.openai.com) or [aistudio.google.com](https://aistudio.google.com) | Free tier / Smart Offline Heuristic Fallback active |
| **Cloudinary** *(Optional)* | Cloud Image Hosting for Receipts | [cloudinary.com](https://cloudinary.com) | 100% Free (Memory & Base64 storage fallback active) |

> **Zero Crash Guarantee:** Even without any AI or Cloudinary keys configured, Monetra runs smoothly. Voice speech is transcribed directly in the browser, receipts are processed safely via memory storage, and transactions are classified with intelligent heuristic fallback.

---

## 📋 Environment Variables

You can find a ready-to-use template in [.env.example](file:///.env.example).

### Backend Variables (`server/.env` or Vercel Environment Variables):

```env
PORT=8000
BASE_PATH=/api
NODE_ENV=production

# Frontend Origin for CORS (e.g., https://your-monetra-app.vercel.app)
FRONTEND_ORIGIN=http://localhost:5173

# Authentication Security (Generate any random 32+ character strings)
JWT_SECRET=monetra_production_super_secure_jwt_secret_key_32_characters_minimum
JWT_REFRESH_SECRET=monetra_production_super_secure_jwt_refresh_secret_key_32_characters

# PostgreSQL Database (Free on Neon: https://neon.tech)
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DIRECT_DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require

# AI Vision & Voice Classification (OpenAI or Gemini)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

### Frontend Variables (`client/.env`):

```env
# URL pointing to your backend API
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Deployment to Vercel

Monetra is architected for zero-maintenance Vercel deployment:

### Deploy Backend (`server`):
1. In Vercel, click **Add New Project** and select your GitHub repository.
2. Set the **Root Directory** to `server`.
3. Under **Environment Variables**, add the backend variables listed above (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_ORIGIN`, etc.).
4. Click **Deploy**. Note your backend URL (e.g. `https://monetra-api.vercel.app`).

### Deploy Frontend (`client`):
1. In Vercel, click **Add New Project** and select the same repository.
2. Set the **Root Directory** to `client`.
3. Under **Environment Variables**, add:
   ```env
   VITE_API_URL=https://your-backend-api.vercel.app/api
   ```
4. Click **Deploy**.
5. Update `FRONTEND_ORIGIN` in your backend Vercel project settings to match your new client URL.

---

## 💻 Local Development

### 1. Install Dependencies
```bash
# In the project root
npm run install:all
```

### 2. Start Both Client & Server
```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000/api`

---

## 🛡️ License & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS, Redux Toolkit Query, Lucide Icons, Recharts
- **Backend**: NestJS 10, Drizzle ORM, Express, Passport JWT
- **Database**: PostgreSQL with Drizzle ORM (automated local fallback mode when offline)

---

## ☕ Support Independent Development

If Monetra helps you manage your finances, support independent development via **USDT (TRC20)**:

- **Network:** USDT (TRC20) — Tron Blockchain
- **USDT (TRC20) Address:** `TAneq9f7QbigXjqANj6UxUrW83hm1vGCSV`

> 💡 Please send only USDT via the TRC-20 network to this address. Contributions help keep the project open and actively maintained.

---

## 👨‍💻 Developed By

Developed with ❤️ by **Subhan Kashif**.

