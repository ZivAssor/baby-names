export const SITE_NAME = 'דשבורד השמות של ישראל';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://babiesil.com';
export const SITE_DESCRIPTION =
  'מחפשים שם לבייבי שבדרך? כאן תמצאו את השמות הנפוצים והנדירים בישראל, מגמות של שמות לאורך השנים, התפלגות בין בנים לבנות ועוד — על בסיס נתוני הלשכה המרכזית לסטטיסטיקה, 1949–2024.';

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-WPC9JGKS';

export const FIRST_YEAR = 1949;
export const LAST_YEAR = 2024;
export const YEAR_COUNT = LAST_YEAR - FIRST_YEAR + 1;
export const SUPPRESSED = -1;

export const DEFAULT_RANGE = { start: 2015, end: LAST_YEAR };

export const GROUPS = ['jewish', 'muslim', 'christian', 'druze'] as const;
export type Group = (typeof GROUPS)[number];
export type Gender = 'm' | 'f';

export const GROUP_LABELS: Record<Group, string> = {
  jewish: 'יהודים',
  muslim: 'מוסלמים',
  christian: 'נוצרים ערבים',
  druze: 'דרוזים',
};

export const GENDER_LABELS: Record<Gender, string> = {
  m: 'בנים',
  f: 'בנות',
};

/** URL path for a group's home view — Jewish is the site root */
export function groupPath(group: Group): string {
  return group === 'jewish' ? '/' : `/${group}`;
}

export function namePath(name: string): string {
  return `/name/${encodeURIComponent(name)}`;
}

export function letterPath(letter: string): string {
  return `/names/${encodeURIComponent(letter)}`;
}

// Validated categorical palette (dataviz six-checks, light surface):
// boys #2563eb, girls #ec4899, event highlight #f59e0b
export const BOY_COLOR = 'rgba(37, 99, 235, 0.9)';
export const GIRL_COLOR = 'rgba(236, 72, 153, 0.9)';
