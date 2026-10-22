# AI Resume Roaster — Complete Deployment Guide

This guide provides end-to-end instructions for deploying **AI Resume Roaster** both **locally** (development & production preview) and to the **cloud on Vercel**.

---

## Architecture & Tech Stack Overview

- **Framework**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Authentication**: NextAuth.js v4 (Google OAuth, GitHub OAuth, and Instant Demo Account)
- **Database & ORM**: Prisma ORM with MySQL (local) or hosted MySQL / Supabase PostgreSQL (cloud)
- **AI Engine**: Google Gemini API (`@google/generative-ai` SDK with native JSON structured output)
- **Document Processing**: `pdf-parse` (evaluated 100% in server memory without saving to disk)

---

## Part 1: Local Deployment Guide

Follow these steps to run AI Resume Roaster on your local machine.

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ installed ([Download Node.js](https://nodejs.org/))
- **MySQL**: MySQL Server running locally on port `3306` (e.g. via MySQL Workbench, XAMPP, or Docker)
- **Git**: Installed and configured

### 2. Clone and Install Dependencies

```bash
# Clone the repository (if not already in directory)
git clone <your-repo-url>
cd resumeRoaster

# Install dependencies
npm install
```

### 3. Configure Local Environment Variables

Create a file named `.env` in the root of the project:

```env
# ==============================================================================
# AI Resume Roaster - Local Environment Variables
# ==============================================================================

# --- Google Gemini AI API ---
# Get your API key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY="your_actual_gemini_api_key_here"
GEMINI_MODEL="gemini-3.8-flash"

# --- Local MySQL Database (Prisma) ---
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
# Note: Special characters in passwords (like @ or $) must be URL-encoded (%40, %24)
DATABASE_URL="mysql://root:YourPassword@localhost:3306/resume_roaster"

# --- NextAuth.js Configuration ---
NEXTAUTH_URL="http://localhost:3000"
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your_generated_random_secret_32_characters_long"

# --- Google OAuth Provider (Optional for Demo Testing) ---
# https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# --- GitHub OAuth Provider (Optional for Demo Testing) ---
# https://github.com/settings/developers
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
```

### 4. Setup Local Database

Ensure your MySQL service is running, create the database, and sync the Prisma schema:

```bash
# 1. Open MySQL CLI or Workbench and run:
# CREATE DATABASE resume_roaster;

# 2. Push Prisma schema to MySQL
npx prisma db push

# 3. Generate Prisma client
npx prisma generate
```

### 5. Run the Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Instant Demo Access**: You don't need OAuth to test the app. Click **Sign In** and use the **Course Evaluator & Demo Sign-In** option on the `/auth/signin` page to sign in immediately.

### 6. Local Production Build & Preview

To test how the application runs in a simulated production environment:

```bash
# 1. Build the production bundle
npm run build

# 2. Start the production server
npm start
```

---

## Part 2: Cloud Deployment on Vercel

Vercel is the recommended hosting platform for Next.js 14 App Router applications.

### 1. Cloud Database Setup (Prerequisite for Vercel)

> [!IMPORTANT]
> Vercel runs serverless functions in the cloud. It **cannot** connect to `localhost:3306`. You must connect Vercel to a cloud-hosted database.

#### Option A: Hosted MySQL (Keeps `provider = "mysql"`)
Use a managed cloud MySQL provider like **Aiven for MySQL**, **PlanetScale**, or **Railway**:
1. Create a free MySQL database on [Aiven](https://aiven.io/) or [Railway](https://railway.app/).
2. Obtain the external connection string (e.g. `mysql://avnadmin:password@mysql-xyz.aivencloud.com:port/defaultdb?ssl-mode=REQUIRED`).
3. Set this as `DATABASE_URL` in your `.env` and run:
   ```bash
   npx prisma db push
   ```

#### Option B: Supabase PostgreSQL (Course Default)
If migrating to Supabase PostgreSQL:
1. Update [`prisma/schema.prisma`](file:///c:/Users/shiva/OneDrive/finanalytics/full%20stack/resumeRoaster/prisma/schema.prisma):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```
2. In Supabase Dashboard, navigate to **Project Settings** $\rightarrow$ **Database** $\rightarrow$ **Connection Pooling** (`port 6543`) and **Direct Connection** (`port 5432`).
3. Run `npx prisma db push`.

---

### 2. Push Code to GitHub

Make sure `.env` and `.env.local` are listed in your [`.gitignore`](file:///c:/Users/shiva/OneDrive/finanalytics/full%20stack/resumeRoaster/.gitignore) so secrets are never pushed:

```bash
git add .
git commit -m "feat: ready for vercel deployment"
git push origin master
```

---

### 3. Import Project into Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select your GitHub repository (`resumeRoaster`).
4. Keep the Framework Preset as **Next.js**.
5. Build and Output Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

---

### 4. Configure Environment Variables on Vercel

In the Vercel project setup screen under **Environment Variables**, add the following keys for **Production**, **Preview**, and **Development**:

| Variable Name | Value Description | Example / Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cloud database connection string | `mysql://...` or `postgresql://...` |
| `NEXTAUTH_URL` | Your public Vercel domain | `https://your-project.vercel.app` |
| `NEXTAUTH_SECRET` | 32+ character random secret | Generate with `openssl rand -base64 32` |
| `GEMINI_API_KEY` | Your Google AI Studio API Key | Starts with `AIza...` or `AQ...` |
| `GEMINI_MODEL` | Gemini Model Identifier | `gemini-3.8-flash` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | From Google Cloud Console |
| `GITHUB_ID` | GitHub OAuth App Client ID | From GitHub Developer Settings |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret | From GitHub Developer Settings |

---

### 5. Update OAuth Redirect URIs in Developer Consoles

Once Vercel assigns your domain (e.g. `https://resume-roaster.vercel.app`):

#### Google Cloud Console:
1. Go to **Google Cloud Console** $\rightarrow$ **APIs & Services** $\rightarrow$ **Credentials**.
2. Select your OAuth 2.0 Client ID.
3. Under **Authorized redirect URIs**, add:
   ```text
   https://your-project.vercel.app/api/auth/callback/google
   ```
4. Under **Authorized JavaScript origins**, add:
   ```text
   https://your-project.vercel.app
   ```

#### GitHub Developer Settings:
1. Go to **GitHub Settings** $\rightarrow$ **Developer settings** $\rightarrow$ **OAuth Apps** $\rightarrow$ Your App.
2. Update **Homepage URL**: `https://your-project.vercel.app`
3. Update **Authorization callback URL**:
   ```text
   https://your-project.vercel.app/api/auth/callback/github
   ```

---

### 6. Deploy and Verify

1. Click **Deploy** in Vercel.
2. Vercel will install dependencies, run `npx prisma generate`, compile all routes, and assign your live URL.
3. Once deployed, verify:
   - **Home Page**: [https://your-project.vercel.app](https://your-project.vercel.app)
   - **Authentication**: Test login with Google, GitHub, and Demo account.
   - **Resume Roasting**: Upload a sample PDF resume, select roast intensity, and trigger roast.
   - **Private Results**: Verify score ring animation, section scores, critique, and Markdown/Print export.
   - **Public Share Card**: Open the share link in an Incognito window to confirm anonymous viewing.
   - **Candidate Dashboard**: Check roast history table and Recharts score progression chart.

---

## Part 3: Troubleshooting & FAQ

### 1. `EPERM: operation not permitted` on Windows
- **Cause**: Windows file lock on `query_engine-windows.dll.node` when running `npm run build` while `npm run dev` is active in another terminal.
- **Fix**: The `build` script in `package.json` has been made resilient. If you need to regenerate the Prisma client locally, simply stop `npm run dev` before running `npx prisma generate`.

### 2. Gemini API `404 Not Found`
- **Cause**: Model name mismatch or deprecation (e.g. `gemini-1.5-flash` or `gemini-2.5-flash` returning 404 for newly provisioned Google AI Studio accounts).
- **Fix**: Ensure `GEMINI_MODEL=gemini-3.8-flash` is set in both `.env` and Vercel environment variables.

### 3. NextAuth Sign-in Redirects to `localhost:3000` on Vercel
- **Cause**: `NEXTAUTH_URL` environment variable on Vercel was left as `http://localhost:3000`.
- **Fix**: Update `NEXTAUTH_URL` in Vercel Project Settings $\rightarrow$ Environment Variables to `https://your-project.vercel.app` and redeploy.

### 4. Database Connection Timeout on Vercel
- **Cause**: Serverless functions exhausting database connection limits without pooling.
- **Fix**: Use connection pooling (e.g. Supabase port `6543` with `?pgbouncer=true` or Aiven pooler).
