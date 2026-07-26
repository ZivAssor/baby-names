import type { RankedName } from './data';

const nf = new Intl.NumberFormat('he-IL');

export function formatNumber(n: number): string {
  return nf.format(n);
}

/**
 * Display a range count honestly: when some years in the range are suppressed
 * (CBS hides yearly values of 1–4), the number is a lower bound — mark it with +.
 */
export function countDisplay({ count, suppressedYears }: RankedName): string {
  return suppressedYears > 0 ? `${nf.format(count)}+` : nf.format(count);
}

export function rangeLabel(start: number, end: number): string {
  return `${end}–${start}`;
}
