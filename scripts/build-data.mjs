/**
 * build-data.mjs — generates the site's data artifacts from the CBS source file.
 *
 * Source: data/source/cbs-names-1949-2024.xlsx
 *   CBS "השמות הנוכחיים של ילידי 1949-2024" — 8 sheets (population group × gender).
 *   Sheet layout: row 0 title, row 1 subtitle, row 2 header [prati1, סך הכל, 1949..2024],
 *   rows 3+ one name each. Cell values: non-negative ints, comma-formatted strings
 *   for thousands ("5,151"), or ".." meaning suppressed (a count of 1–4 hidden by
 *   CBS for privacy).
 *
 * Suppression handling (IMPORTANT): ".." is stored as -1 in count arrays, never 0.
 *   The CBS "סך הכל" column is the count of everyone currently registered with the
 *   name — including suppressed years AND people born before 1949 (e.g. immigrants
 *   born abroad), who have no year column at all. So `total` >= visible sum +
 *   suppressed-year count, and the remaining gap is pre-1949/suppressed mass that
 *   cannot be attributed to specific years.
 *
 * Outputs (data/generated/, committed):
 *   series/{group}-{gender}.json  — full per-name yearly series
 *   aggregates.json               — per group+gender yearly sums, name counts
 *   name-directory.json           — unique name → the (group,gender) series it has
 *   meta.json                     — provenance, year range, validation summary
 *
 * Run: npm run build:data
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'data', 'source', 'cbs-names-1949-2024.xlsx');
const OUT_DIR = join(ROOT, 'data', 'generated');

const FIRST_YEAR = 1949;
const SUPPRESSED = -1; // sentinel for CBS ".." (a hidden count of 1–4)

// LAST_YEAR is derived from the file header below, so a future CBS file that
// adds a year only requires updating LAST_YEAR in lib/constants.ts to match
// (lib/data.ts asserts the two agree and fails the build otherwise).
let LAST_YEAR = 0;
let YEAR_COUNT = 0;

const SHEETS = [
  { sheet: 'בנות יהודיות', group: 'jewish', gender: 'f' },
  { sheet: 'בנים יהודים', group: 'jewish', gender: 'm' },
  { sheet: 'בנות מוסלמיות', group: 'muslim', gender: 'f' },
  { sheet: 'בנים מוסלמים', group: 'muslim', gender: 'm' },
  { sheet: 'בנות נוצריות-ערביות', group: 'christian', gender: 'f' },
  { sheet: 'בנים נוצרים-ערבים', group: 'christian', gender: 'm' },
  { sheet: 'בנות דרוזיות', group: 'druze', gender: 'f' },
  { sheet: 'בנים דרוזים', group: 'druze', gender: 'm' },
];

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function parseCell(value, where) {
  if (value === undefined || value === null || value === '') return 0;
  if (value === '..' || value === '.') return SUPPRESSED;
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) fail(`non-integer count ${value} at ${where}`);
    return value;
  }
  if (typeof value === 'string') {
    const n = Number(value.replace(/,/g, ''));
    if (!Number.isInteger(n) || n < 0) fail(`unparseable cell "${value}" at ${where}`);
    return n;
  }
  fail(`unexpected cell type ${typeof value} at ${where}`);
}

// Characters that may legitimately appear in a name. Trailing geresh/gershayim
// (ג'ורג', בת') are real Hebrew orthography and must be kept; a LEADING quote is
// a CBS data-entry artifact (e.g. "'ג'ורג'"), stripped and merged below.
const VALID_NAME = /^[֐-׿][֐-׿ '"-]*$/;

function normalizeName(raw, where) {
  if (typeof raw !== 'string') fail(`non-string name ${JSON.stringify(raw)} at ${where}`);
  const name = raw.replace(/\s+/g, ' ').trim().replace(/^['"]+/, '');
  if (!name) fail(`empty name at ${where}`);
  return name;
}

/**
 * Merge two rows of the same name (happens when a CBS artifact row normalizes
 * into an existing name). Totals add exactly; per-year: two visible values add,
 * suppressed + 0 stays suppressed, suppressed + visible keeps the visible value
 * (the hidden 1–4 is still inside the CBS total, like every suppressed year).
 */
function mergeInto(target, total, counts) {
  target.t += total;
  for (let i = 0; i < counts.length; i++) {
    const a = target.c[i];
    const b = counts[i];
    if (a >= 0 && b >= 0) target.c[i] = a + b;
    else if (a === SUPPRESSED && b <= 0) target.c[i] = SUPPRESSED;
    else target.c[i] = Math.max(a, b);
  }
}

function parseSheet(workbook, { sheet, group, gender }) {
  const ws = workbook.Sheets[sheet];
  if (!ws) fail(`missing sheet "${sheet}"`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

  const header = rows[2];
  if (header[0] !== 'prati1' || header[1] !== 'סך הכל') {
    fail(`unexpected header in "${sheet}": ${JSON.stringify(header.slice(0, 3))}`);
  }
  if (LAST_YEAR === 0) {
    // First sheet defines the year range; the rest must match it exactly.
    LAST_YEAR = Number(header[header.length - 1]);
    YEAR_COUNT = LAST_YEAR - FIRST_YEAR + 1;
    if (!Number.isInteger(LAST_YEAR) || YEAR_COUNT < 1) {
      fail(`cannot derive year range from header of "${sheet}"`);
    }
  }
  for (let i = 0; i < YEAR_COUNT; i++) {
    if (Number(header[2 + i]) !== FIRST_YEAR + i) {
      fail(`year column mismatch in "${sheet}" at index ${i}: ${header[2 + i]}`);
    }
  }
  if (header.length !== 2 + YEAR_COUNT) fail(`header length ${header.length} in "${sheet}"`);

  const names = [];
  const byName = new Map();
  let suppressedCells = 0;

  for (let r = 3; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;
    const where = `${sheet} row ${r + 1}`;
    const name = normalizeName(row[0], where);
    if (name === 'סך הכל') fail(`aggregate row found at ${where}`);
    if (!VALID_NAME.test(name)) {
      console.warn(`  ⚠ skipping artifact row ${JSON.stringify(name)} at ${where}`);
      continue;
    }

    const total = parseCell(row[1], `${where} total`);
    if (total === SUPPRESSED || total < 5) fail(`suspicious total ${total} at ${where}`);

    const counts = new Array(YEAR_COUNT);
    let visibleSum = 0;
    let suppressedYears = 0;
    for (let i = 0; i < YEAR_COUNT; i++) {
      const v = parseCell(row[2 + i], `${where} year ${FIRST_YEAR + i}`);
      counts[i] = v;
      if (v === SUPPRESSED) suppressedYears++;
      else visibleSum += v;
    }
    suppressedCells += suppressedYears;

    // The CBS total counts everyone currently registered with the name, including
    // people born BEFORE 1949 (e.g. immigrants born abroad) who have no year column.
    // So the only hard invariant is a lower bound: each ".." year hides at least 1.
    if (total < visibleSum + suppressedYears) {
      fail(`total ${total} below visible ${visibleSum} + ${suppressedYears} suppressed years at ${where}`);
    }

    const existing = byName.get(name);
    if (existing) {
      console.warn(`  ⚠ merging duplicate row for ${JSON.stringify(name)} at ${where}`);
      mergeInto(existing, total, counts);
    } else {
      const entry = { n: name, t: total, c: counts };
      byName.set(name, entry);
      names.push(entry);
    }
  }

  names.sort((a, b) => a.n.localeCompare(b.n, 'he'));
  return { group, gender, names, suppressedCells };
}

function buildAggregates(seriesList) {
  const aggregates = {};
  for (const { group, gender, names } of seriesList) {
    const yearlyVisibleSum = new Array(YEAR_COUNT).fill(0);
    const yearlySuppressedNames = new Array(YEAR_COUNT).fill(0);
    let totalSum = 0;
    for (const { t, c } of names) {
      totalSum += t;
      for (let i = 0; i < YEAR_COUNT; i++) {
        if (c[i] === SUPPRESSED) yearlySuppressedNames[i]++;
        else yearlyVisibleSum[i] += c[i];
      }
    }
    aggregates[`${group}-${gender}`] = {
      nameCount: names.length,
      totalSum,
      yearlyVisibleSum,
      yearlySuppressedNames,
    };
  }
  return aggregates;
}

function buildDirectory(seriesList) {
  // name → { series: [{group, gender, total}], totalAll }
  const directory = new Map();
  for (const { group, gender, names } of seriesList) {
    for (const { n, t } of names) {
      if (!directory.has(n)) directory.set(n, { series: [], totalAll: 0 });
      const entry = directory.get(n);
      entry.series.push({ group, gender, total: t });
      entry.totalAll += t;
    }
  }
  const sorted = [...directory.entries()].sort((a, b) => a[0].localeCompare(b[0], 'he'));
  return sorted.map(([name, { series, totalAll }]) => ({ name, totalAll, series }));
}

const workbook = XLSX.readFile(SOURCE);
const seriesList = SHEETS.map((s) => parseSheet(workbook, s));

mkdirSync(join(OUT_DIR, 'series'), { recursive: true });

for (const { group, gender, names } of seriesList) {
  const payload = {
    group,
    gender,
    firstYear: FIRST_YEAR,
    lastYear: LAST_YEAR,
    suppressedSentinel: SUPPRESSED,
    names,
  };
  writeFileSync(join(OUT_DIR, 'series', `${group}-${gender}.json`), JSON.stringify(payload));
}

const aggregates = buildAggregates(seriesList);
writeFileSync(
  join(OUT_DIR, 'aggregates.json'),
  JSON.stringify({ firstYear: FIRST_YEAR, lastYear: LAST_YEAR, aggregates }, null, 1),
);

const directory = buildDirectory(seriesList);
writeFileSync(join(OUT_DIR, 'name-directory.json'), JSON.stringify(directory));

// Compact client-side search index: [name, totalAll, seriesMask]
// Mask bit i set ⇔ the name exists in SHEETS[i] (jewish-f, jewish-m, muslim-f, ...).
const maskIndex = new Map(SHEETS.map((s, i) => [`${s.group}-${s.gender}`, i]));
const searchIndex = directory
  .map(({ name, totalAll, series }) => {
    let mask = 0;
    for (const s of series) mask |= 1 << maskIndex.get(`${s.group}-${s.gender}`);
    return [name, totalAll, mask];
  })
  .sort((a, b) => b[1] - a[1]);
writeFileSync(join(OUT_DIR, 'search-index.json'), JSON.stringify(searchIndex));

const meta = {
  source: 'data/source/cbs-names-1949-2024.xlsx',
  sourceDescription:
    'הלשכה המרכזית לסטטיסטיקה — השמות הנוכחיים של ילידי 1949-2024 לפי מין וקבוצת אוכלוסייה, שם פרטי ושנת לידה',
  firstYear: FIRST_YEAR,
  lastYear: LAST_YEAR,
  suppressedSentinel: SUPPRESSED,
  suppressionNote:
    'ערכים שנתיים בין 1 ל-4 מוסתרים על ידי הלמ"ס מטעמי צנעת הפרט ומסומנים כ--1; עמודת הסך הכל כוללת גם אותם',
  sheets: Object.fromEntries(
    seriesList.map(({ group, gender, names, suppressedCells }) => [
      `${group}-${gender}`,
      { nameCount: names.length, suppressedCells },
    ]),
  ),
  uniqueNames: directory.length,
};
writeFileSync(join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 1));

console.log('✓ generated', OUT_DIR);
for (const [key, info] of Object.entries(meta.sheets)) {
  console.log(`  ${key}: ${info.nameCount} names, ${info.suppressedCells} suppressed cells`);
}
console.log(`  unique names across all series: ${meta.uniqueNames}`);
