import { ogImage, OG_SIZE } from '@/lib/og';
import { SITE_NAME } from '@/lib/constants';

export const alt = SITE_NAME;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage(SITE_NAME, [
    'סטטיסטיקות על שמות פרטיים בישראל',
    'נתוני הלמ״ס',
    '1949-2024',
  ]);
}
