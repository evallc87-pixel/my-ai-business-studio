# MY AI BUSINESS STUDIO — Vercel + Gemini version

Same studio as the Cloudflare version (v1.12), rebuilt for **Vercel** (hosting) +
**Google Gemini API** (the AI). Same dashboard, same 4 AI tools, same 500 daily
credits, same 3 languages. Only the AI behind it changed, because Cloudflare's
Workers AI kept hanging.

## Files

- `index.html` — the whole dashboard (same page as before)
- `api/analyze.js` — Product Analyzer (server-side money math included)
- `api/finder.js` — Product Finder AI
- `api/video.js` — AI Video Marketing
- `api/post-text.js` — Marketing Post Creator text
- `api/_gemini.js` — shared Gemini helper (primary `gemini-3.5-flash-lite`,
  fallback `gemini-3.8-flash`, 20 seconds per try)
- `vercel.json` — allows API functions to run up to 60 seconds

## Deploy — 3 steps, all free

### Step 1 — Gemini API key (free, no card)

1. Go to https://aistudio.google.com
2. Sign in with Google.
3. Click **Get API key** (top left) → **Create API key**.
4. Copy the key. Keep it secret — never paste it in a chat or a public page.
   You will paste it into Vercel in Step 3 only.

### Step 2 — GitHub repo (free)

1. Go to https://github.com — sign up / sign in (Google sign-in works).
2. **New repository**, name: `my-ai-business-studio`, Public, **Create repository**.
3. **Add file → Upload files** — upload all 7 files from this folder,
   keeping the `api/` folder structure (index.html and vercel.json at the top,
   the 5 `.js` files inside `api/`).
4. **Commit changes**.

### Step 3 — Vercel (free Hobby plan)

1. Go to https://vercel.com — sign up / sign in (Continue with GitHub).
2. **Add New → Project → Import** the `my-ai-business-studio` repository.
3. Before deploying, open **Environment Variables** and add:
   - Name: `GEMINI_API_KEY`
   - Value: the key from Step 1 (paste it here only, nowhere else)
4. **Deploy**. Vercel gives you a live URL like
   `my-ai-business-studio.vercel.app`.
5. Open the URL and test the 4 tools: Analyzer, Finder, Video, Post Creator.

## Notes

- Vercel Hobby (free) is for personal / non-commercial use. If the studio
  later becomes a paid service for other people, the Pro plan is $20/month.
- Gemini free tier: no card needed. Flash-Lite models allow hundreds of free
  requests per day. If the daily limit is hit, the tools show an error until
  the limit resets at midnight Pacific time.
- If a tool ever shows "The AI is busy right now. Please try again.", just
  click again — the server already tried two AI models for you.
- The Cloudflare version stays as-is; nothing there needs to change.
