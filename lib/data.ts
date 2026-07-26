// Server-only data API. All statistics the app shows are computed here, at
// build time or inside route handlers — never in the browser.
//
// Suppression semantics: a count of -1 (SUPPRESSED) means CBS hid a value of
// 1–4 for privacy. Range sums therefore have a lower bound of
// visible + suppressedYears (each hidden year is at least 1). The CBS `t`
// total additionally includes people born before 1949, so `t` can exceed any
// sum over the year columns.
import {
  FIRST_YEAR,
  LAST_YEAR,
  SUPPRESSED,
  type Gender,
  type Group,
  GROUPS,
} from './constants';
import {
  aggregatesFile,
  directory,
  meta,
  searchIndex,
  seriesFiles,
  type DirectoryEntry,
  type RawNameSeries,
  type SeriesKey,
} from './load-data';

export type { DirectoryEntry, SeriesKey };

// Fail the build loudly if the generated data and the app constants disagree
// (e.g. a new CBS file added a year but lib/constants.ts was not updated).
if (aggregatesFile.firstYear !== FIRST_YEAR || aggregatesFile.lastYear !== LAST_YEAR) {
  throw new Error(
    `data/generated covers ${aggregatesFile.firstYear}–${aggregatesFile.lastYear} but lib/constants.ts declares ${FIRST_YEAR}–${LAST_YEAR}; update LAST_YEAR and re-run npm run build:data`,
  );
}

export function yearIndex(year: number): number {
  return year - FIRST_YEAR;
}

export function clampYear(year: number): number {
  return Math.min(LAST_YEAR, Math.max(FIRST_YEAR, year));
}

export interface RangeStats {
  /** sum of the published yearly values in the range */
  visible: number;
  /** number of years in the range whose value is hidden (each hides 1–4) */
  suppressedYears: number;
}

export function rangeStats(counts: number[], startYear: number, endYear: number): RangeStats {
  let visible = 0;
  let suppressedYears = 0;
  for (let i = yearIndex(startYear); i <= yearIndex(endYear); i++) {
    const v = counts[i];
    if (v === SUPPRESSED) suppressedYears++;
    else visible += v;
  }
  return { visible, suppressedYears };
}

export interface RankedName {
  name: string;
  /** visible count in the range (lower bound when suppressedYears > 0) */
  count: number;
  suppressedYears: number;
}

export function topNames(
  group: Group,
  gender: Gender,
  startYear: number,
  endYear: number,
  limit = 7,
): RankedName[] {
  const { names } = seriesFiles[`${group}-${gender}`];
  const ranked: RankedName[] = [];
  for (const { n, c } of names) {
    const { visible, suppressedYears } = rangeStats(c, startYear, endYear);
    if (visible === 0) continue;
    // Rank by the same lower bound rarestNames uses (each hidden year is ≥1),
    // so both cards follow the documented site-wide methodology.
    ranked.push({ name: n, count: visible + suppressedYears, suppressedYears });
  }
  ranked.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'he'));
  return ranked.slice(0, limit);
}

/**
 * Honest "rarest names": only names that actually appeared in the range
 * (visible or suppressed evidence), ranked by the LOWER BOUND of their count
 * (visible + 1 per suppressed year). The old site ranked suppressed-to-zero
 * artifacts and returned the alphabet's first zero rows.
 */
export function rarestNames(
  group: Group,
  gender: Gender,
  startYear: number,
  endYear: number,
  limit = 7,
): RankedName[] {
  const { names } = seriesFiles[`${group}-${gender}`];
  const ranked: (RankedName & { allTime: number })[] = [];
  for (const { n, t, c } of names) {
    const { visible, suppressedYears } = rangeStats(c, startYear, endYear);
    const lowerBound = visible + suppressedYears;
    if (lowerBound === 0) continue; // did not appear in the range at all
    ranked.push({ name: n, count: lowerBound, suppressedYears, allTime: t });
  }
  ranked.sort(
    (a, b) =>
      a.count - b.count || a.allTime - b.allTime || a.name.localeCompare(b.name, 'he'),
  );
  return ranked.slice(0, limit).map(({ name, count, suppressedYears }) => ({
    name,
    count,
    suppressedYears,
  }));
}

export interface SeriesDetail {
  group: Group;
  gender: Gender;
  /** CBS all-time total (includes suppressed years and pre-1949 births) */
  total: number;
  /** yearly counts, index 0 = FIRST_YEAR, -1 = suppressed */
  counts: number[];
  /** % of that group+gender's visible births per year; null when suppressed or no denominator */
  shares: (number | null)[];
}

export interface NameDetail {
  name: string;
  totalAll: number;
  totalM: number;
  totalF: number;
  groups: Group[];
  series: SeriesDetail[];
  /** first year with evidence of the name (visible or suppressed) */
  firstYear: number | null;
  /** year with the highest combined visible count */
  peakYear: number | null;
  peakCount: number;
  /** number of this name's series whose peak-year value is suppressed — when > 0, peakCount is a lower bound */
  peakSuppressedSeries: number;
  /** combined visible count in LAST_YEAR */
  latestCount: number;
  /** number of this name's series whose LAST_YEAR value is suppressed — when > 0, latestCount is a lower bound */
  latestSuppressedSeries: number;
  /** rank in LAST_YEAR within the name's strongest group+gender (1-based), if it appeared */
  latestRank: { group: Group; gender: Gender; rank: number } | null;
}

const seriesByName = new Map<SeriesKey, Map<string, RawNameSeries>>();
function seriesLookup(key: SeriesKey): Map<string, RawNameSeries> {
  let m = seriesByName.get(key);
  if (!m) {
    m = new Map(seriesFiles[key].names.map((entry) => [entry.n, entry]));
    seriesByName.set(key, m);
  }
  return m;
}

const directoryByName = new Map<string, DirectoryEntry>(directory.map((d) => [d.name, d]));

const latestRankCache = new Map<SeriesKey, Map<string, number>>();
function latestRanks(key: SeriesKey): Map<string, number> {
  let m = latestRankCache.get(key);
  if (!m) {
    const i = yearIndex(LAST_YEAR);
    const ranked = seriesFiles[key].names
      .filter(({ c }) => c[i] > 0)
      .sort((a, b) => b.c[i] - a.c[i]);
    // Competition ranking: equal counts share the same rank.
    m = new Map();
    let rank = 0;
    let prevCount = -1;
    ranked.forEach(({ n, c }, idx) => {
      if (c[i] !== prevCount) {
        rank = idx + 1;
        prevCount = c[i];
      }
      m!.set(n, rank);
    });
    latestRankCache.set(key, m);
  }
  return m;
}

export function getNameDetail(name: string): NameDetail | null {
  const entry = directoryByName.get(name);
  if (!entry) return null;

  const series: SeriesDetail[] = [];
  let totalM = 0;
  let totalF = 0;
  for (const s of entry.series) {
    const key: SeriesKey = `${s.group}-${s.gender}`;
    const raw = seriesLookup(key).get(name);
    if (!raw) continue;
    const denominators = aggregatesFile.aggregates[key].yearlyVisibleSum;
    const shares = raw.c.map((v, i) => {
      if (v === SUPPRESSED || denominators[i] <= 0) return null;
      return (v * 100) / denominators[i];
    });
    series.push({ group: s.group, gender: s.gender, total: raw.t, counts: raw.c, shares });
    if (s.gender === 'm') totalM += raw.t;
    else totalF += raw.t;
  }

  let firstYear: number | null = null;
  let peakYear: number | null = null;
  let peakCount = 0;
  let peakSuppressedSeries = 0;
  for (let i = 0; i < LAST_YEAR - FIRST_YEAR + 1; i++) {
    let combined = 0;
    let suppressed = 0;
    let evidence = false;
    for (const s of series) {
      const v = s.counts[i];
      if (v === SUPPRESSED) {
        suppressed++;
        evidence = true;
      } else if (v > 0) {
        combined += v;
        evidence = true;
      }
    }
    if (evidence && firstYear === null) firstYear = FIRST_YEAR + i;
    if (combined > peakCount) {
      peakCount = combined;
      peakYear = FIRST_YEAR + i;
      peakSuppressedSeries = suppressed;
    }
  }
  const lastIdx = yearIndex(LAST_YEAR);
  let latestCount = 0;
  let latestSuppressedSeries = 0;
  for (const s of series) {
    const v = s.counts[lastIdx];
    if (v === SUPPRESSED) latestSuppressedSeries++;
    else if (v > 0) latestCount += v;
  }

  let latestRank: NameDetail['latestRank'] = null;
  let bestLatest = 0;
  for (const s of series) {
    const v = s.counts[lastIdx];
    if (v > bestLatest) {
      bestLatest = v;
      const rank = latestRanks(`${s.group}-${s.gender}`).get(name);
      if (rank) latestRank = { group: s.group, gender: s.gender, rank };
    }
  }

  const groups = [...new Set(entry.series.map((s) => s.group))];
  return {
    name,
    totalAll: entry.totalAll,
    totalM,
    totalF,
    groups,
    series,
    firstYear,
    peakYear,
    peakCount,
    peakSuppressedSeries,
    latestCount,
    latestSuppressedSeries,
    latestRank,
  };
}

export interface GroupStats {
  group: Group;
  boyNames: number;
  girlNames: number;
  totalPeople: number;
}

export function groupStats(group: Group): GroupStats {
  const m = aggregatesFile.aggregates[`${group}-m`];
  const f = aggregatesFile.aggregates[`${group}-f`];
  return {
    group,
    boyNames: m.nameCount,
    girlNames: f.nameCount,
    totalPeople: m.totalSum + f.totalSum,
  };
}

export function siteTotals(): { names: number; people: number } {
  let people = 0;
  for (const g of GROUPS) people += groupStats(g).totalPeople;
  return { names: meta.uniqueNames, people };
}

/** Default showcase name for a group: the unisex name with the biggest combined total, falling back to the group's most common name. */
export function defaultNameFor(group: Group): string {
  let bestUnisex: { name: string; total: number } | null = null;
  let bestAny: { name: string; total: number } | null = null;
  for (const entry of directory) {
    const inGroup = entry.series.filter((s) => s.group === group);
    if (inGroup.length === 0) continue;
    const total = inGroup.reduce((acc, s) => acc + s.total, 0);
    if (!bestAny || total > bestAny.total) bestAny = { name: entry.name, total };
    const genders = new Set(inGroup.map((s) => s.gender));
    if (genders.size === 2 && (!bestUnisex || total > bestUnisex.total)) {
      bestUnisex = { name: entry.name, total };
    }
  }
  return (bestUnisex ?? bestAny)?.name ?? 'נועם';
}

export function allNames(): DirectoryEntry[] {
  return directory;
}

export function getSearchIndex(): [string, number, number][] {
  return searchIndex;
}

export function getMeta() {
  return meta;
}

/** Hebrew letters (plus any other leading character) that begin at least one name, in Hebrew collation order. */
export function letterIndex(): { letter: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const { name } of directory) {
    const letter = name[0];
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'he'))
    .map(([letter, count]) => ({ letter, count }));
}

export function namesByLetter(letter: string): DirectoryEntry[] {
  return directory
    .filter(({ name }) => name.startsWith(letter))
    .sort((a, b) => b.totalAll - a.totalAll);
}

// Sorted-by-popularity view built once — relatedNames is called for every
// prerendered name page, so it must not rescan the whole directory each time.
let byTotal: DirectoryEntry[] | null = null;
let byTotalIndex: Map<string, number> | null = null;
function popularityOrder(): { list: DirectoryEntry[]; index: Map<string, number> } {
  if (!byTotal || !byTotalIndex) {
    byTotal = [...directory].sort((a, b) => b.totalAll - a.totalAll);
    byTotalIndex = new Map(byTotal.map((d, i) => [d.name, i]));
  }
  return { list: byTotal, index: byTotalIndex };
}

/** Names with the closest all-time totals to the given name — small crawl mesh between name pages. */
export function relatedNames(name: string, limit = 8): DirectoryEntry[] {
  const { list, index } = popularityOrder();
  const i = index.get(name);
  if (i === undefined) return [];
  // Neighbors in the popularity ordering are exactly the closest totals.
  const window = list.slice(Math.max(0, i - limit), i + limit + 1).filter((d) => d.name !== name);
  const target = Math.log(list[i].totalAll + 1);
  return window
    .sort(
      (a, b) =>
        Math.abs(Math.log(a.totalAll + 1) - target) - Math.abs(Math.log(b.totalAll + 1) - target),
    )
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Year pages, trending, and landing-page queries
// ---------------------------------------------------------------------------

export interface YearMover {
  name: string;
  /** visible count; when the matching *Suppressed flag is true the real value is 1–4 */
  current: number;
  previous: number;
  currentSuppressed: boolean;
  previousSuppressed: boolean;
  delta: number;
}

/** Biggest absolute year-over-year movers. Suppressed endpoints (hidden 1–4)
 *  are never treated as 0: the delta uses the lower bound of 1 and the flags
 *  let the UI render "1–4" instead of a false exact number. */
export function yearMovers(
  year: number,
  group: Group,
  gender: Gender,
  limit = 5,
): { risers: YearMover[]; fallers: YearMover[] } {
  if (year <= FIRST_YEAR) return { risers: [], fallers: [] };
  const i = yearIndex(year);
  const movers: YearMover[] = [];
  for (const { n, c } of seriesFiles[`${group}-${gender}`].names) {
    const currentSuppressed = c[i] === SUPPRESSED;
    const previousSuppressed = c[i - 1] === SUPPRESSED;
    const current = currentSuppressed ? 1 : Math.max(0, c[i]);
    const previous = previousSuppressed ? 1 : Math.max(0, c[i - 1]);
    if (current < 30 && previous < 30) continue;
    movers.push({
      name: n,
      current,
      previous,
      currentSuppressed,
      previousSuppressed,
      delta: current - previous,
    });
  }
  movers.sort((a, b) => b.delta - a.delta);
  return {
    risers: movers.slice(0, limit).filter((m) => m.delta > 0),
    fallers: movers.slice(-limit).reverse().filter((m) => m.delta < 0),
  };
}

/** Visible births per group for a given year. */
export function yearBirths(year: number): { group: Group; m: number; f: number }[] {
  const i = yearIndex(year);
  return GROUPS.map((group) => ({
    group,
    m: aggregatesFile.aggregates[`${group}-m`].yearlyVisibleSum[i],
    f: aggregatesFile.aggregates[`${group}-f`].yearlyVisibleSum[i],
  }));
}

export interface TrendingName {
  name: string;
  /** average count in the recent window (lower bound when currentSuppressed > 0) */
  current: number;
  /** average count in the earlier window (lower bound when pastSuppressed > 0) */
  past: number;
  /** suppressed years inside each window — when > 0 the average is a lower bound */
  currentSuppressed: number;
  pastSuppressed: number;
  /** current / past (computed on the lower-bound averages) */
  ratio: number;
}

export const TREND_CURRENT: [number, number] = [LAST_YEAR - 2, LAST_YEAR]; // 2022–2024
export const TREND_PAST: [number, number] = [LAST_YEAR - 7, LAST_YEAR - 5]; // 2017–2019

/** Window average using the suppression lower bound (each hidden year ≥ 1). */
function windowAvg(
  c: number[],
  [from, to]: [number, number],
): { avg: number; suppressedYears: number } {
  let sum = 0;
  let suppressedYears = 0;
  for (let y = from; y <= to; y++) {
    const v = c[yearIndex(y)];
    if (v === SUPPRESSED) {
      sum += 1;
      suppressedYears++;
    } else {
      sum += Math.max(0, v);
    }
  }
  return { avg: sum / (to - from + 1), suppressedYears };
}

// Minimum window-average for inclusion, scaled to each population's size so
// smaller groups can still surface risers/fallers.
const TREND_MIN_VOLUME: Record<Group, number> = { jewish: 60, muslim: 30, christian: 8, druze: 8 };

/** Names rising/falling fastest between two 3-year windows (5 years apart). */
export function trendingNames(
  group: Group,
  gender: Gender,
  limit = 10,
): { risers: TrendingName[]; fallers: TrendingName[]; windows: { current: [number, number]; past: [number, number] } } {
  const minVolume = TREND_MIN_VOLUME[group];
  const entries: TrendingName[] = [];
  for (const { n, c } of seriesFiles[`${group}-${gender}`].names) {
    const current = windowAvg(c, TREND_CURRENT);
    const past = windowAvg(c, TREND_PAST);
    if (current.avg < 5 && past.avg < 5) continue;
    // +1 smoothing keeps brand-new names finite and comparable
    entries.push({
      name: n,
      current: Math.round(current.avg),
      past: Math.round(past.avg),
      currentSuppressed: current.suppressedYears,
      pastSuppressed: past.suppressedYears,
      ratio: (current.avg + 1) / (past.avg + 1),
    });
  }
  const risers = entries
    .filter((e) => e.current >= minVolume && e.ratio > 1)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, limit);
  const fallers = entries
    .filter((e) => e.past >= minVolume && e.ratio < 1)
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, limit);
  return { risers, fallers, windows: { current: TREND_CURRENT, past: TREND_PAST } };
}

/** Unisex names: both genders present with a meaningful minority share. */
export function unisexNames(limit = 50): { name: string; totalM: number; totalF: number; totalAll: number }[] {
  const out: { name: string; totalM: number; totalF: number; totalAll: number }[] = [];
  for (const entry of directory) {
    let totalM = 0;
    let totalF = 0;
    for (const s of entry.series) {
      if (s.gender === 'm') totalM += s.total;
      else totalF += s.total;
    }
    if (totalM === 0 || totalF === 0) continue;
    const minority = Math.min(totalM, totalF) / (totalM + totalF);
    if (minority >= 0.25 && entry.totalAll >= 100) {
      out.push({ name: entry.name, totalM, totalF, totalAll: entry.totalAll });
    }
  }
  return out.sort((a, b) => b.totalAll - a.totalAll).slice(0, limit);
}

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return h >>> 0;
}

/** Rare names still in living use: smallest all-time totals with evidence in the last 15 years.
 *  Hundreds of names tie at the CBS floor (total = 5), so ties break by most recent
 *  use and then a stable hash — not alphabetically, which would fill the whole list
 *  with names starting at א. */
export function rareNames(limit = 60): { name: string; totalAll: number; gender: Gender | 'both' }[] {
  const cutoff = yearIndex(LAST_YEAR - 14);
  const out: { name: string; totalAll: number; gender: Gender | 'both'; lastUse: number; hash: number }[] = [];
  for (const entry of directory) {
    if (entry.totalAll > 30) continue;
    let lastUse = -1;
    const genders = new Set<Gender>();
    for (const s of entry.series) {
      genders.add(s.gender);
      const raw = seriesLookup(`${s.group}-${s.gender}`).get(entry.name);
      if (!raw) continue;
      for (let i = cutoff; i < raw.c.length; i++) {
        if (raw.c[i] !== 0 && i > lastUse) lastUse = i;
      }
    }
    if (lastUse < 0) continue;
    out.push({
      name: entry.name,
      totalAll: entry.totalAll,
      gender: genders.size === 2 ? 'both' : [...genders][0],
      lastUse,
      hash: nameHash(entry.name),
    });
  }
  return out
    .sort((a, b) => a.totalAll - b.totalAll || b.lastUse - a.lastUse || a.hash - b.hash)
    .slice(0, limit)
    .map(({ name, totalAll, gender }) => ({ name, totalAll, gender }));
}

/** All-time most common names for a gender (CBS totals, summed across groups). */
export function allTimeTop(gender: Gender, limit = 20): { name: string; total: number }[] {
  const out: { name: string; total: number }[] = [];
  for (const entry of directory) {
    let total = 0;
    for (const s of entry.series) if (s.gender === gender) total += s.total;
    if (total > 0) out.push({ name: entry.name, total });
  }
  return out.sort((a, b) => b.total - a.total).slice(0, limit);
}
