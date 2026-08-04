export const SITE_NAME = 'דשבורד השמות של ישראל';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://babiesil.com';

export const FIRST_YEAR = 1949;
export const LAST_YEAR = 2024;

// Search demand uses vocabulary the brand name doesn't (אתר שמות, מאגר שמות -
// GSC 2026-08). The description carries it so those queries have text to
// match, while SITE_NAME keeps the דשבורד brand that converts at 73-93% CTR.
export const SITE_DESCRIPTION = `אתר השמות של ישראל: בדקו כמה אנשים נושאים את השם שלכם, כמה נדיר השם ואיך הפופולריות שלו השתנתה לאורך השנים - מאגר השמות המלא של הלמ״ס, ${FIRST_YEAR}-${LAST_YEAR}.`;

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-WPC9JGKS';
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

/** URL path for a group's home view - Jewish is the site root */
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
