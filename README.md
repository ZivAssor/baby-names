# דשבורד השמות של ישראל · [babiesil.com](https://babiesil.com)

Statistics on Israeli first names (1949–2024), based on the official CBS
(הלשכה המרכזית לסטטיסטיקה) names file — all population groups (Jewish, Muslim,
Christian-Arab, Druze), boys and girls. ~20,000 server-rendered pages.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Chart.js.
Hosted on Vercel, DNS on Cloudflare.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (prerenders ~2,100 pages)
```

**Deploying**: push to `main` — Vercel builds and deploys automatically.

## Site map

| Route | What it is |
|---|---|
| `/` · `/muslim` · `/christian` · `/druze` | Interactive dashboard per population group |
| `/name/[name]` | Per-name page: facts, trend chart, gender split (top 2,000 prerendered, rest on demand) |
| `/names` · `/names/[letter]` | Alphabetical browse (~19,900 names) |
| `/year/[1949–2024]` · `/years` | Most popular names of each year + year-over-year movers |
| `/boys` · `/girls` | Gender hubs: current leaders, all-time classics, breakout names |
| `/unisex` · `/rare` | Unisex names with gender split; rare-but-in-use names |
| `/trending` | Fastest rising/falling names (3-year windows, per-group thresholds) |
| `/stories` · `/stories/[slug]` | Data-verified cultural stories (e.g. what זוהר ארגוב did to the name אלינור) |
| `/about` | Data source and methodology (+ Dataset/FAQ structured data) |
| `/api/*` | Small JSON endpoints powering the interactive widgets |

## Architecture

- `data/source/` — the committed CBS source xlsx (provenance).
- `scripts/build-data.mjs` — parses the xlsx into compact JSON in
  `data/generated/` (committed). Suppressed CBS values (`".."`, meaning a
  hidden 1–4) are stored as `-1`, never as `0`.
- `lib/load-data.js` — static imports of the generated JSON (server bundle
  only; the dataset never ships to the browser). Typed via `load-data.d.ts`.
- `lib/data.ts` — all statistics calculations, with honest suppression
  handling: hidden years count as lower bounds and are marked (`+` / `לפחות`)
  in the UI, never silently treated as zero.
- `lib/stories.ts` — curated name stories; every number is verified against
  the data and every cultural claim against sources.
- OG images are generated at request time with `next/og` using the bundled
  Heebo fonts (`assets/fonts/`), with a word-reversal shim for satori's
  missing Hebrew bidi support (`lib/og.tsx`).

See [CLAUDE.md](./CLAUDE.md) for conventions, gotchas and runbooks
(yearly data update, adding a story, infrastructure map).

## Updating the data (yearly)

When CBS publishes a new names file:

1. Replace the file in `data/source/` (update `SOURCE` in
   `scripts/build-data.mjs` if the name changed).
2. `npm run build:data` — validates the sheet structure, derives the year
   range from the header, warns on artifact rows.
3. Update `LAST_YEAR` in `lib/constants.ts` — the build fails with a clear
   error if the two disagree.
4. Commit the source + regenerated `data/generated/` and push.

## Environment

See `.env.example`: `NEXT_PUBLIC_SITE_URL` (canonical origin) and
`NEXT_PUBLIC_GTM_ID` (Google Tag Manager container).

## Data license & attribution

Data: הלשכה המרכזית לסטטיסטיקה (CBS), "השמות הנוכחיים של ילידי 1949–2024".
Yearly counts under 5 are suppressed by CBS for privacy; the site marks these
as lower bounds rather than zeros. Interpretations (trends, stories) are the
site's own.
