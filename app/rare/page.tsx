import type { Metadata } from 'next';
import Link from 'next/link';
import { GENDER_LABELS, namePath, SITE_NAME } from '@/lib/constants';
import { rareNames } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'שמות נדירים — השמות הכי לא שגרתיים בישראל',
  description: `שמות שפחות מ-30 תושבי ישראל נושאים אותם — אבל עדיין בשימוש בשנים האחרונות. רשימה אמיתית מנתוני הלמ״ס, למי שמחפשים שם שאף אחד בגן לא יחלוק. | ${SITE_NAME}`,
  canonical: '/rare',
});

const GENDER_TAG: Record<string, string> = {
  m: GENDER_LABELS.m,
  f: GENDER_LABELS.f,
  both: 'בנים ובנות',
};

export default function RarePage() {
  const names = rareNames(60);
  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">שמות נדירים</h1>
      <p className="pb-4 text-muted-foreground">
        השמות ברשימה ניתנו לפחות מ-30 תושבי ישראל בסך הכול — אבל כולם היו בשימוש ב-15 השנים
        האחרונות. שימו לב: שמות שניתנו לפחות מ-5 אנשים בסך הכול לא מופיעים כלל בנתוני הלמ״ס,
        כך שהנדירים באמת עוד יותר נדירים מזה.
      </p>
      <section className="rounded-xl border border-border bg-card shadow-sm p-6">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
          {names.map(({ name, totalAll, gender }) => (
            <li key={name}>
              <Link href={namePath(name)} className="text-foreground hover:text-primary hover:underline">
                {name}
              </Link>
              <span className="ms-1.5 text-xs text-muted-foreground">
                {formatNumber(totalAll)} · {GENDER_TAG[gender]}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-4 text-sm text-muted-foreground">
        מעדיפים דווקא את הבטוח?{' '}
        <Link href="/boys" className="text-primary hover:underline">
          שמות לבנים
        </Link>{' '}
        ·{' '}
        <Link href="/girls" className="text-primary hover:underline">
          שמות לבנות
        </Link>{' '}
        ·{' '}
        <Link href="/unisex" className="text-primary hover:underline">
          שמות יוניסקס
        </Link>
      </p>
    </div>
  );
}
