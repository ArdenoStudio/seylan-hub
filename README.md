# Seylan Hub

**AI banking for Sri Lanka** — diaspora wallets, voice assistant, loan health, and bookkeeping for SMEs.

Built in 24 hours for **Cursor Buildathon Colombo 2026** by Ardeno Studio.

## Live Demo

🌐 **Frontend:** [seylan-hub.vercel.app](https://seylan-hub.vercel.app) _(Vercel)_

## Architecture

| Layer | Tech | Owner |
|-------|------|-------|
| Frontend | Next.js 15, Tailwind, shadcn/ui | Ovindu |
| Backend | FastAPI, Supabase, Groq | Suven |
| Realtime | Supabase Postgres Changes | Both |
| AI | Groq llama-3.3-70b, ElevenLabs TTS | Suven |
| Deploy | Vercel (frontend), Railway (backend) | Both |

## Modules

| Module | Route | Persona |
|--------|-------|---------|
| Diaspora Family Wallet | `/wallet` | P1 — Sri Lankan expat sending money home |
| AI Assistant | `/assistant` | P2 — Digital-native customer (EN + Sinhala) |
| Loan Dashboard | `/loans` | P3 — Anxious borrower needing clarity |
| Business Bookkeeper | `/business` | P4 — Mudalali (SME owner) |

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000

# Backend (separate repo/directory)
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```

## Environment Variables

See `frontend/.env.example` for all required variables. Set `NEXT_PUBLIC_USE_MOCK=true` to run with demo data (no backend needed).

## Demo Notes

- Frontend demo controls live at `/demo` for spend trigger, tax jar trigger,
  reset, and prewarm actions.
- The deployed UI shows whether it is using demo data or the live API.
- Wallet realtime has a polling fallback so the demo can continue if Supabase
  realtime is unavailable.

## Credits

- **Seylan Bank** — Sponsor & banking domain
- **Groq** — Fast LLM inference (llama-3.3-70b)
- **ElevenLabs** — Text-to-speech
- **Supabase** — Realtime database & auth
- **Vercel** — Frontend hosting & edge functions
- **Cursor** — AI-assisted development

## Team — Ardeno Studio

- **Ovindu** — Frontend Lead
- **Suven** — Backend Lead
