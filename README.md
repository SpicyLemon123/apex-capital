# Apex Capital — AI-Powered Investment Firm

A virtual investment firm where five autonomous AI agents research, model, and execute value investing strategies — guided by a single human CEO.

## Stack
- React + Vite (frontend)
- Vercel Edge Functions (secure API proxy)
- Anthropic Claude API (AI agents)

## Deploy to Vercel

### 1. Install dependencies
```bash
npm install
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Apex Capital"
git remote add origin https://github.com/SpicyLemon123/apex-capital.git
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to vercel.com → New Project → Import your GitHub repo
2. Add environment variable: `ANTHROPIC_API_KEY` = your key
3. Click Deploy

Your site will be live at `apex-capital.vercel.app`

## Local development
```bash
npm run dev
```
