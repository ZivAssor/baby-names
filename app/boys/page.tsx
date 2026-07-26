import type { Metadata } from 'next';
import GenderHub from '@/components/GenderHub';
import { LAST_YEAR, SITE_NAME } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'שמות לבנים - המובילים, הקלאסיים והמתפרצים',
  description: `מחפשים שם לבן? השמות המובילים ב-${LAST_YEAR}, הקלאסיקות של כל הזמנים והשמות שמתפרצים עכשיו - על בסיס נתוני הלמ״ס. | ${SITE_NAME}`,
  canonical: '/boys',
});

export default function BoysPage() {
  return <GenderHub gender="m" />;
}
