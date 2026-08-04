import { LAST_YEAR } from '@/lib/constants';
import { topNames } from '@/lib/data';
import { ogImage, OG_SIZE } from '@/lib/og';

export const alt = 'השמות הפופולריים בישראל';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  const boy = topNames('jewish', 'm', LAST_YEAR, LAST_YEAR, 1)[0];
  const girl = topNames('jewish', 'f', LAST_YEAR, LAST_YEAR, 1)[0];
  const parts = [`הרשימה המלאה של ${LAST_YEAR}`];
  // Nationally the top boys' name is from the muslim sector (מוחמד), so an
  // unscoped names teaser under the "בישראל" headline would be wrong. Scope it.
  if (boy && girl) parts.push(`מובילים במגזר היהודי: ${boy.name} · ${girl.name}`);
  parts.push('נתוני הלמ״ס');
  return ogImage('השמות הפופולריים בישראל', parts);
}
