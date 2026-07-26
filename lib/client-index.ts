// Client-side access to the compact name index ([name, totalAll, seriesMask]).
// Fetched lazily once per session (~100KB gzipped) — the full dataset never
// reaches the browser.
import type { Gender, Group } from './constants';

export type IndexEntry = [name: string, totalAll: number, seriesMask: number];

// Bit order must match SHEETS in scripts/build-data.mjs
const MASK_ORDER: `${Group}-${Gender}`[] = [
  'jewish-f',
  'jewish-m',
  'muslim-f',
  'muslim-m',
  'christian-f',
  'christian-m',
  'druze-f',
  'druze-m',
];

export function maskFor(group?: Group, gender?: Gender): number {
  let mask = 0;
  MASK_ORDER.forEach((key, i) => {
    const [g, s] = key.split('-') as [Group, Gender];
    if ((group === undefined || g === group) && (gender === undefined || s === gender)) {
      mask |= 1 << i;
    }
  });
  return mask;
}

let indexPromise: Promise<IndexEntry[]> | null = null;

export function loadIndex(): Promise<IndexEntry[]> {
  if (!indexPromise) {
    indexPromise = fetch('/api/search-index')
      .then((res) => {
        if (!res.ok) throw new Error(`search index fetch failed: ${res.status}`);
        return res.json() as Promise<IndexEntry[]>;
      })
      .catch((err) => {
        indexPromise = null; // allow retry on transient failure
        throw err;
      });
  }
  return indexPromise;
}

/** Names matching a substring, restricted to a series mask, ordered by popularity (index is pre-sorted). */
export function filterIndex(
  index: IndexEntry[],
  query: string,
  mask: number,
  limit = 10,
): IndexEntry[] {
  // The data uses ASCII ' and " for geresh/gershayim; Hebrew keyboards often
  // produce the Unicode characters U+05F3 / U+05F4 — normalize them.
  const q = query.trim().replace(/\u05F3/g, "'").replace(/\u05F4/g, '"');
  if (!q) return [];
  const starts: IndexEntry[] = [];
  const contains: IndexEntry[] = [];
  for (const entry of index) {
    if ((entry[2] & mask) === 0) continue;
    if (entry[0].startsWith(q)) starts.push(entry);
    else if (entry[0].includes(q)) contains.push(entry);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
