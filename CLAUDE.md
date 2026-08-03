# CLAUDE.md — baby-names (babiesil.com)

Hebrew RTL statistics site for Israeli first names, 1949–2024, based on the
official CBS (למ״ס) names file. Live at https://babiesil.com. ~20,000
server-rendered pages. Stack: Next.js 16 App Router, TypeScript, Tailwind 4,
shadcn/ui (base-nova style: @base-ui/react + cmdk), custom server-rendered
SVG charts, deployed on Vercel (push to main = deploy).

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build (prerenders ~2,100 pages, ~15s)
npm run build:data   # regenerate data/generated/ from the CBS xlsx
```

Deploy = `git push` to `main` (Vercel GitHub integration auto-deploys, ~2 min).

## Architecture (data flow)

```
data/source/cbs-names-*.xlsx        committed CBS source (8 sheets: 4 population groups × 2 genders)
  → scripts/build-data.mjs          validates + normalizes; run manually when new CBS file arrives
  → data/generated/*.json           committed artifacts (series, aggregates, name-directory, search-index)
  → lib/load-data.js                static imports, SERVER BUNDLE ONLY (plain JS so tsc never
                                    type-infers 8MB of JSON; types in load-data.d.ts)
  → lib/data.ts                     ALL statistics calculations live here
  → app/** pages + app/api/**       server-render everything; client widgets call the small APIs
```

The browser never receives the dataset. Client-side search uses the compact
index from `/api/search-index` (~100KB gzipped, lazy-loaded); interactive
widgets call `/api/ranked-names` and `/api/name/[name]`.

## CRITICAL: suppression honesty

CBS hides yearly counts of 1–4 for privacy (`".."` in the xlsx). This site's
core data-integrity contract, violated by the pre-2026 version and enforced
everywhere since:

- In `data/generated`, suppressed values are stored as **-1** (`SUPPRESSED`),
  never 0.
- A suppressed value must NEVER surface in the UI as 0 or as an exact number.
  Range sums count each suppressed year as ≥1 and are displayed as lower
  bounds: `1,234+`, `לפחות 1,234`, or `1–4` for a single year. Charts render
  suppressed years as gaps (`null`), not zeros.
- The CBS `total` (`t`) column counts ALL current registrants — including
  people born before 1949 (immigrants) — so `t >= sum(visible years) +
  suppressed-year count`, and the gap is NOT only suppression.
- When ranking (top/rarest/trending/movers), rank by the lower bound
  (`visible + suppressedYears`), consistent with `rangeStats`.

If you add any new statistic, check what `-1` does to it before shipping.
Two review rounds caught exactly this class of bug in freshly written code.

## Hebrew/RTL gotchas (each one bit us)

- **Trailing** geresh/apostrophe in names is legitimate orthography
  (ג'ורג', אריג', בת'). Only **leading** quotes are CBS artifacts —
  `build-data.mjs` strips them and merges duplicates. Never strip trailing.
- `generateStaticParams` must return **raw Hebrew strings**, not
  `encodeURIComponent`-ed ones — pre-encoding breaks runtime param matching
  (404s when `dynamicParams = false`).
- OG images: satori (`next/og`) does **no bidi reordering** — Hebrew renders
  mirrored. `lib/og.tsx#rtlLine()` fakes RTL by reversing word order and
  reversing characters inside Hebrew-containing words only. Multi-line
  wrapping breaks reading order, so subtitle content is rendered as
  single-line chips in a `row-reverse` flex row. Fonts: static Heebo
  instances in `assets/fonts/` (satori can't use variable fonts), traced into
  the OG routes via `outputFileTracingIncludes` in next.config.mjs.
- Sort Hebrew with `localeCompare(x, 'he')`.
- Alphabetical tie-breaks on large tied sets produce all-א lists (the
  old site's "rarest names" bug, re-introduced once and caught in review).
  Break ties by something meaningful (recency, hash) before falling back to
  alphabet.
- Search input normalization: keyboards produce U+05F3/U+05F4 (geresh/
  gershayim); the data uses ASCII `'` / `"` — normalized in
  `lib/client-index.ts`.

## Code conventions

- **No em/en dashes in any user-facing copy** - use a regular dash (-).
  Owner's explicit rule (site must not read as machine-written). Applies to UI
  strings, story texts, metadata descriptions, and OG images.
- **Charts are custom SSR'd SVG** (components/charts/TrendLine.tsx,
  GenderBar.tsx) - NOT a chart library. Client components, so they hydrate for
  hover/crosshair, but the full SVG with all data points ships in the initial
  HTML (crawlable - a deliberate GEO feature; keep it that way). They own a
  `dir="ltr"` relative container internally. Do not reintroduce chart.js.
- Design tokens live in app/globals.css (:root oklch variables; warm stone
  background, indigo primary). Use bg-card/bg-muted/text-muted-foreground
  etc., never raw gray-* / blue-* utilities - EXCEPT gender coding, which
  stays literal blue/pink (validated palette: boys #2563eb, girls #ec4899,
  event highlight #f59e0b).
- Global name search: components/GlobalSearch.tsx (trigger + Ctrl/Cmd+K via
  e.code so Hebrew layouts work) lazy-loads components/SearchDialog.tsx
  (cmdk) on first open - keep it lazy, it is ~64KB gzipped.

- Client components (`'use client'`) must never value-import `lib/data.ts` or
  `lib/load-data.js` (would pull megabytes into the bundle). Type-only
  imports (`import type`) are fine and used.
- Every page's metadata goes through `lib/seo.ts#pageMetadata()` — Next merges
  metadata shallowly per top-level key and does NOT inherit og:title from the
  page title, so partial `openGraph` objects silently wipe the layout's.
- Interactive fetches use a request-sequence guard (see
  `components/home/useNameDetail.ts`) so a slow earlier response can't
  overwrite a newer selection.
- Facts prose (`lib/text.ts`) and story numbers (`lib/stories.ts`) are cited
  by AI assistants — every number must match the generated data exactly.

## Yearly data update (when CBS publishes a new file)

1. Put the new xlsx at `data/source/` and update `SOURCE` in
   `scripts/build-data.mjs` if the filename/range changed.
2. `npm run build:data` — the script validates sheet structure and derives the
   year range from the header; it warns on artifact rows and merges duplicates.
3. Bump `LAST_YEAR` in `lib/constants.ts` — the build **fails loudly** if it
   disagrees with the generated data.
4. Check hardcoded prose years: trending windows derive from LAST_YEAR
   automatically; story texts are frozen history and need no update.
5. Commit source + regenerated `data/generated/`, push (auto-deploys).

## Adding a name story (`lib/stories.ts`)

1. Mine candidates: one-year spike scan (value vs prev-3yr average) over the
   series files. Already RESEARCHED AND UNEXPLAINED (do NOT publish without
   new evidence - no sourced trigger was found): בר 1989, שירן 1983,
   נסרין 1976, שירין 1977, היבא 1980, וסאם 1975, אשרף 1974, סמאהר 1976,
   יובל-בנות 1992. Medium-confidence held back for a possible future batch:
   דור 1985 (Hanan Yuval album), לובנה 1975 (Qays wa Lubna TV series),
   ג'ורי 2017 (Turkish drama dub - trigger plausible but two sources failed
   verification).
2. Verify the cultural trigger with web sources (we caught a wrong attribution
   this way - אגם רודברג was never on כוכב נולד).
3. Verify EVERY number in the prose against `data/generated/series/*.json`
   (two review rounds each caught a wrong number in draft prose).
4. Keep causal language careful (מתאם, not הוכחה) - the story page includes a
   standing disclaimer. Published stories as of 2026-07: 28 (13 original +
   15 in the July 2026 batch, incl. the first muslim-sector stories).

## Infrastructure

- **Vercel**: team `zivassor-6063s-projects`, project `baby-names`
  (ids in `.vercel/project.json`). GitHub-connected: push to main deploys.
  `www` → apex 308 redirect configured at the Vercel domain level.
  Web Analytics enabled (+ `<Analytics/>` in layout). Env vars in `.env.example`.
- **DNS**: Cloudflare zone `babiesil.com` (all records DNS-only/grey cloud —
  required for Vercel). Registrar: GoDaddy (nameservers → Cloudflare).
- **Search Console**: domain property `sc-domain:babiesil.com`; owners:
  zivassor@gmail.com + rsvp@rsvpevents.co.il. Sitemap submitted. The Search
  Analytics API is reachable with the user's gcloud ADC credentials
  (webmasters scope, quota project `baby-names-dashboard`) — used for the
  recurring "SEO review" ritual: pull top queries, find position 8–20
  opportunities and low-CTR pages, fix.
- **Analytics** (two stacks, deliberately - state as of 2026-08):
  - Vercel Web Analytics (`<Analytics/>` in layout): cookieless, counts every
    session, visitor hash resets daily (no cross-day users). Source of truth
    for raw traffic counts.
  - GA4 property "Babies IL" (`G-YEQRQ1YEKF`) is bundled inside GTM
    `GTM-WPC9JGKS` (env `NEXT_PUBLIC_GTM_ID`). GTM + GA4 both live under
    **rsvp@rsvpevents.co.il** (GTM account "RSVP"), NOT under
    zivassor@gmail.com. GA4 is linked to Search Console (reports published)
    and event retention is set to 14 months. Use GA4 for landing pages,
    channels (incl. the "AI Assistant" channel - measures the GEO strategy)
    and returning visitors.
  - GTM injects on first gesture / 3.5s idle (`components/GtmLoader.tsx`,
    mobile-INP trade-off), so GA4 misses short no-gesture visits and reads
    engagement optimistically high vs Vercel. The container (v12+) maps
    dataLayer `originalLocation` → `page_location` on the Google tag so
    tap-first sessions attribute to the true landing page - re-add that
    mapping if the Google tag is ever rebuilt. Container is minimal on
    purpose: one Google tag, one Page View trigger (old-site click tags
    were deleted in v13).
  - Share buttons (`components/ShareButton.tsx`) append
    `utm_source=share_sheet|whatsapp&utm_medium=social` so shared visits
    classify as Organic Social instead of Direct; the copy-link URL stays
    clean on purpose.
- **Privacy**: `/privacy` (footer-linked) discloses the GA4/GTM cookies,
  Vercel's cookieless analytics and hosting logs. Deliberate 2026-08
  decision: notice-based compliance, NO consent banner (Israeli law has no
  statutory cookie-banner requirement post-Amendment 13; the enforceable
  duty is notice). Keep `/privacy` in sync when the analytics stack changes.
- The old Google Cloud Run deployment is decommissioned; do not add Docker or
  GitHub Actions deploy workflows.
