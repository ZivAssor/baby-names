import { getNameDetail } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { ogImage, OG_SIZE } from '@/lib/og';

export const alt = 'סטטיסטיקות על השם';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let decoded = '';
  try {
    decoded = decodeURIComponent(name);
  } catch {
    // fall through to the generic image below
  }
  const detail = decoded ? getNameDetail(decoded.trim()) : null;

  if (!detail) {
    return ogImage('שם לא נמצא', ['סטטיסטיקות על שמות פרטיים בישראל']);
  }
  const parts = [`${formatNumber(detail.totalAll)} תושבי ישראל`];
  if (detail.peakYear) parts.push(`שנת שיא: ${detail.peakYear}`);
  parts.push('נתוני הלמ״ס 1949–2024');
  return ogImage(`השם ${detail.name}`, parts);
}
