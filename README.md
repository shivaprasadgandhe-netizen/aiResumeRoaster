# AI Resume Roaster 🔥

> **A production-quality Next.js 14 web app for the Finlatics Full-Stack Development Course Project.**  
> Upload your PDF resume for brutally funny yet constructive critiques, deep ATS keyword gap detection, and actionable career advice powered by Google Gemini.

---

## 🌟 Live Demo & Preview
- **Live Deployment**: Deployable directly to [Vercel](https://vercel.com) (HTTP 200 verified).
- **Course Track**: Finlatics Full-Stack Engineering — Project 2.

---

## 🚀 Key Features

### 1. In-Memory PDF Extraction
- Upload resumes up to **5 MB** in PDF format (`.pdf`).
- Extracted in server RAM via `pdf-parse/lib/pdf-parse.js` with zero disk or permanent database file persistence for complete privacy.
- Intelligent character threshold validation: returns user-friendly guidance if fewer than 200 readable characters are detected (e.g. scanned image or empty PDF).

### 2. Google Gemini Structured AI Roast
- Powered exclusively by the official `@google/generative-ai` SDK (defaulting to `gemini-1.5-flash`).
- Strict schema enforcement via `generationConfig.responseMimeType: "application/json"` and `responseSchema`.
- Runtime validation with **Zod** (`RoastResultSchema`) and automatic exponential backoff retry logic (up to 2 retries).

### 3. Roast Intensity Selector
- **Gentle**: Empathetic, supportive mentor offering warm constructive feedback.
- **Medium**: Candid, sarcastic recruiter calling out buzzword density.
- **Brutal**: Merciless, laugh-out-loud roast master general dissecting corporate clichés.

### 4. Target Job Description Matching
- Optional JD input textarea.
- Calculates an exact **Role Fit Percentage (0–100%)** and summarizes critical missing qualifications.

### 5. Animated Score Ring & Celebratory Confetti
- Custom circular SVG score meter color-coded by performance tiers:
  - 🚨 **0–49**: Needs Immediate CPR (Red)
  - ⚠️ **50–69**: Lukewarm Average (Amber)
  - 🔷 **70–84**: Competitive Contender (Cyan)
  - 🏆 **85–100**: Top-Tier Heavyweight (Emerald)
- Fires a multi-directional confetti blast (`canvas-confetti`) whenever the score hits **85 or higher**.

### 6. Public Shareable Roast Card
- Share your roast with friends at `/share/[id]`.
- Dynamic Open Graph metadata (`generateMetadata`) generates rich social cards on Twitter/LinkedIn/Discord.
- **Privacy Guaranteed**: Owner email and identity are completely redacted from public share views.

### 7. Candidate Analytics Dashboard
- Track your resume iterations over time.
- Overview stat cards: Total Roasts, Average Score, Best Score, and Daily Quota.
- **Score Progression Chart**: Interactive area graph rendered via `recharts`.

### 8. Downloadable & Printable Reports
- Clean print layout (`@media print`) designed for paper or PDF export from your browser.
- One-click **Markdown (.md) Export** containing full scores, verdict, roast text, and ATS tags.

### 9. Engaging Comedic Loading State
- Real-time rotating comedic quotes while Gemini processes your resume.

### 10. NextAuth.js v4 Authentication & Rate Limiting
- Sign in with **Google**, **GitHub**, or an **Instant Evaluator Demo Account**.
- Per-user rate limiting (5 roasts per rolling 24 hours) tracked and enforced in Supabase PostgreSQL via Prisma.

---

## 🛠️ Mandatory Tech Stack

| Technology | Role |
| :--- | :--- |
| **Next.js 14** (App Router) | Core framework with React Server Components & API route handlers |
| **TypeScript** | Strict type safety (`strict: true`, zero `any`) |
| **Tailwind CSS** | Styling, custom flame color tokens, dark/light theme |
| **NextAuth.js v4** | Authentication with Google, GitHub, and Prisma Adapter |
| **Prisma ORM** | Schema modeling and database client |
| **Supabase PostgreSQL** | Pooled database (`DATABASE_URL`, port 6543) & Direct migrations (`DIRECT_URL`) |
| **pdf-parse** | In-memory PDF text extraction |
| **Google Gemini API** | `@google/generative-ai` with structured JSON output |
| **Recharts** | Interactive score history area charts |
| **Sonner** | Modern toast notifications |
| **Canvas Confetti** | High-score celebratory visual effects |

---

## 📂 Project Structure

```
resumeRoaster/
├── .env.example                     # Exhaustive environment variables guide
├── .gitignore                       # Ensures secrets and build output are never committed
├── next.config.mjs                  # Externalizes pdf-parse, sets image domains
├── package.json                     # Scripts and dependencies
├── tailwind.config.ts               # Theme tokens & dark mode configuration
├── tsconfig.json                    # Strict TypeScript rules
├── prisma/
│   └── schema.prisma                # NextAuth models + Roast model
├── types/
│   ├── next-auth.d.ts               # Session user.id type extension
│   └── roast.ts                     # Zod schemas & TypeScript definitions
├── lib/
│   ├── auth.ts                      # NextAuth configuration & getAuthSession()
│   ├── prisma.ts                    # PrismaClient singleton
│   ├── pdf.ts                       # In-memory PDF extraction & validation
│   ├── gemini.ts                    # Gemini client with structured output & retries
│   └── rateLimit.ts                 # 5 roasts/day Prisma rate limiter
├── components/
│   ├── layout/                      # Navbar, Footer, ThemeToggle
│   ├── providers/                   # AuthProvider, ThemeProvider
│   ├── roast/                       # Dropzone, ScoreRing, Critique, Confetti, ATS tags
│   └── dashboard/                   # StatsOverview, ScoreHistoryChart, RoastHistoryTable
├── app/
│   ├── layout.tsx                   # Root layout, fonts, Toaster, SEO metadata
│   ├── page.tsx                     # Landing page with hero & uploader
│   ├── auth/signin/page.tsx         # Google, GitHub, and Demo login
│   ├── api/auth/[...nextauth]/      # NextAuth handlers
│   ├── api/roast/route.ts           # Multipart PDF upload, Gemini roast, Prisma save
│   ├── roast/[id]/page.tsx          # Private full results view for resume owner
│   ├── share/[id]/page.tsx          # Public sanitized shareable card with OG tags
│   └── dashboard/page.tsx           # Authenticated user dashboard with stats & chart
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd resumeRoaster
npm install
```

### 2. Environment Variables Configuration
Copy the template file to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required keys:
```env
# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-1.5-flash"

# Supabase PostgreSQL Database (Prisma)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers (Optional in dev; fallback Demo account is available)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 3. Run Prisma Migrations & Generate Client
```bash
# Push the Prisma schema to Supabase PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 How the Gemini Integration Works

### 1. In-Memory Extraction
When a user uploads a PDF, Next.js receives `request.formData()` in `app/api/roast/route.ts`. The file is converted directly to a Node.js `Buffer` in RAM. `lib/pdf.ts` uses `pdf-parse/lib/pdf-parse.js` to extract text and verifies length $\ge 200$ characters.

### 2. System Instruction & Intensity Tuning
`lib/gemini.ts` constructs a dynamic system prompt depending on whether the user selected **Gentle**, **Medium**, or **Brutal**, and appends the target job description if provided.

### 3. Native Structured Output (`responseSchema`)
We pass `responseSchema` with `responseMimeType: "application/json"` to `@google/generative-ai`:
```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: geminiResponseSchema,
    temperature: intensity === "Brutal" ? 0.9 : 0.7,
  },
});
```

### 4. Zod Validation & Auto-Retry
The parsed JSON is strictly verified against `RoastResultSchema`. If the model fails or produces malformed JSON, an automatic retry is executed (max 2 attempts) with exponential backoff before throwing a descriptive error.

---

## 🚢 Vercel Deployment Checklist

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: AI Resume Roaster initial release"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Link your GitHub repository in the Vercel dashboard.
   - Framework preset: **Next.js**.
   - Build command: `prisma generate && next build`.
3. **Set Environment Variables in Vercel**:
   - `GEMINI_API_KEY`: Your Google AI Studio key.
   - `GEMINI_MODEL`: `gemini-1.5-flash`.
   - `DATABASE_URL`: Supabase pooled connection string (`?pgbouncer=true`).
   - `DIRECT_URL`: Supabase direct connection string.
   - `NEXTAUTH_URL`: Your production Vercel domain (e.g. `https://resume-roaster.vercel.app`).
   - `NEXTAUTH_SECRET`: Random 32+ character secret.
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Configured with authorized redirect URI `https://<your-app>.vercel.app/api/auth/callback/google`.
   - `GITHUB_ID` & `GITHUB_SECRET`: Configured with callback URL `https://<your-app>.vercel.app/api/auth/callback/github`.
4. **Deploy & Verify**:
   - Verify homepage returns HTTP 200.
   - Test PDF upload and roast generation end to end.

---

## 📄 License & Credits
Built for the **Finlatics Full-Stack Development Program**. Powered by **Google Gemini** and **Next.js 14**.
