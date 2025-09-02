# LEXner Frontend (Next.js 14, App Router)

A minimal Next.js frontend for your FastAPI + JWT backend.

## Quickstart

1. Copy `.env.example` to `.env.local` and set the backend:
   ```bash
   cp .env.example .env.local
   # edit .env.local
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```

2. Install & run:
   ```bash
   npm install
   npm run dev
   ```

3. Flow:
   - Open http://localhost:3000
   - Sign up -> Log in
   - Go to Dashboard -> Start new session
   - Upload PDF or Paste text
   - View Case -> Export
   - Graph explorer

## Notes

- JWT is stored in `localStorage` and attached via Axios interceptor.
- Graph is rendered with `react-force-graph`.
- App Router is used: `/` is auth page, `/dashboard`, `/upload`, `/case/[session_id]`, `/graph`.
