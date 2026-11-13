# Uhai Mong — Portfolio Frontend

Personal portfolio SPA (Preact + Vite + Tailwind + Framer Motion) backed by a separate CMS API.

## Stack

- **UI:** Preact, React Router, Tailwind CSS v4, Framer Motion
- **Data:** Axios → portfolio CMS API (`VITE_API_URL`)
- **Deploy:** Vercel (`vercel.json` SPA rewrites + security headers)

## Setup

```bash
npm install
cp .env.example .env.development
npm run dev
```

App runs at `http://localhost:3000`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local Vite server |
| `npm run build` | Production build + sitemap + SEO prerender shells |
| `npm run preview` | Preview the `dist/` build |
| `npm run sitemap` | Regenerate sitemap only |

## Environment

| Variable | Description |
|---|---|
| `VITE_API_URL` | CMS API base (e.g. `https://…/api`) |
| `VITE_SITE_URL` | Public site origin (used for canonical, OG, sitemap) |
| `VITE_EMAIL_*` | Optional EmailJS keys (contact may use CMS instead) |

## Architecture notes

- Global bio / banner / resume load once via `DataContext` (session + memory cache).
- Heavy routes (blog, archives, details) are code-split with `lazy()`.
- `scripts/generate-sitemap.mjs` and `scripts/prerender-meta.mjs` run after Vite build for SEO.
- Design tokens live in `src/index.css` (`--surface`, `--ink`, `--accent`, fonts Syne + DM Sans).

## Related repos

- Backend / CMS API: `../server`
- Admin dashboard: `../dashboard`
