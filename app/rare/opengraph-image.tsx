import { FIRST_YEAR, LAST_YEAR } from '@/lib/constants';
import { rareNames } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { ogImage, OG_SIZE } from '@/lib/og';

export const alt = 'שמות נדירים בישראל';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  const count = rareNames(100_000).length;
  return ogImage('שמות נדירים בישראל', [
    `${formatNumber(count)} שמות נדירים בשימוש היום`,
    'עד 30 תושבים לכל שם',
    `נתוני הלמ״ס ${FIRST_YEAR}-${LAST_YEAR}`,
  ]);
}
