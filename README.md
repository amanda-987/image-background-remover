# Image Background Remover

AI-powered image background removal tool built with Next.js + Cloudflare.

## ✨ Features

- 🆓 100% Free — no signup, no credit card
- 🔒 Privacy First — images are never stored on our servers
- ⚡ Instant — results in 2-5 seconds
- 🖼️ High Quality — powered by remove.bg AI

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + Tailwind CSS v4
- **API**: Next.js API Routes (Cloudflare Workers compatible)
- **AI Service**: [remove.bg API](https://www.remove.bg/api)
- **Deployment**: Cloudflare Pages + Workers

## 🚀 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/amanda-987/image-background-remover.git
cd image-background-remover
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your remove.bg API key:

```
REMOVE_BG_API_KEY=your_api_key_here
```

Get a free API key at: https://www.remove.bg/api (50 free API calls/month)

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deploy to Cloudflare Pages

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. Click **Create a project** → Connect to Git
3. Select your `image-background-remover` repository
4. Build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`

### Step 3: Set Environment Variables

In Cloudflare Pages → Settings → Environment variables:

```
REMOVE_BG_API_KEY = your_remove_bg_api_key
```

### Step 4: Deploy

Cloudflare will automatically deploy on every push to `main`.

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main page (upload + result)
│   ├── globals.css         # Global styles + Tailwind
│   ├── privacy/
│   │   └── page.tsx        # Privacy Policy page
│   └── api/
│       └── remove-bg/
│           └── route.ts    # API route (calls remove.bg)
├── public/                 # Static assets
├── .env.local.example      # Environment variables template
├── wrangler.toml           # Cloudflare Workers config
└── PRD.md                  # Product Requirements Document
```

## 📄 License

MIT
