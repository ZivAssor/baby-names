# דשבורד השמות של ישראל · babiesil.com

Statistics on Israeli first names (1949–2024), based on the official CBS
(הלשכה המרכזית לסטטיסטיקה) names file — all population groups, boys and girls.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Chart.js.
Hosted on Vercel.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (prerenders ~2,000 name pages)
```

## Architecture

- `data/source/` — the committed CBS source xlsx (provenance).
- `scripts/build-data.mjs` — parses the xlsx into compact JSON artifacts in
  `data/generated/` (committed). Suppressed CBS values ("..", meaning 1–4)
  are stored as `-1`, never as `0`.
- `lib/load-data.js` — static imports of the generated JSON (server bundle
  only; the dataset never ships to the browser). Typed via `load-data.d.ts`.
- `lib/data.ts` — all statistics calculations (top/rarest names, per-name
  detail, shares, ranks) with honest suppression handling.
- `app/` — server-rendered pages: home per population group (`/`, `/muslim`,
  `/christian`, `/druze`), per-name pages (`/name/[name]`, top 2,000
  prerendered + on-demand ISR for the rest), alphabetical browse
  (`/names`, `/names/[letter]`), methodology (`/about`), sitemap and robots.
- `app/api/` — small route handlers powering the interactive widgets
  (year-range ranking, name detail, client search index).
- OG images are generated at request time with `next/og` using the bundled
  Heebo fonts (`assets/fonts/`).

## Updating the data (yearly)

When CBS publishes a new names file:

1. Replace `data/source/cbs-names-1949-2024.xlsx` with the new file (update
   the file name and the `SOURCE` constant in `scripts/build-data.mjs` if the
   year range changed).
2. Run `npm run build:data`. The script validates the sheet structure and
   derives the year range from the file header.
3. Update `LAST_YEAR` in `lib/constants.ts` to match. The build fails with a
   clear error if the two disagree.
4. Commit the new source file and the regenerated `data/generated/`.

## Environment

See `.env.example`: `NEXT_PUBLIC_SITE_URL` (canonical origin) and
`NEXT_PUBLIC_GTM_ID` (Google Tag Manager container).
