import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GENDER_LABELS,
  GROUP_LABELS,
  GROUPS,
  namePath,
  SITE_NAME,
  type Gender,
} from '@/lib/constants';
import { TREND_CURRENT, TREND_PAST, trendingNames } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'השמות המזנקים והדועכים בישראל',
  description: `אילו שמות מתפרצים עכשיו ואילו נעלמים? השוואה בין ${TREND_CURRENT[0]}–${TREND_CURRENT[1]} ל-${TREND_PAST[0]}–${TREND_PAST[1]} על בסיס נתוני הלמ״ס, לכל קבוצות האוכלוסייה. | ${SITE_NAME}`,
  canonical: '/trending',
});

function TrendTable({ gender }: { gender: Gender }) {
  const { risers, fallers, windows } = trendingNames('jewish', gender, 10);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
      <h2 className="mb-1 text-xl font-bold">{GENDER_LABELS[gender]}</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        ממוצע שנתי {windows.current[0]}–{windows.current[1]} לעומת {windows.past[0]}–
        {windows.past[1]}
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold text-green-700">מזנקים ↑</h3>
          <ul className="space-y-1.5">
            {risers.map((n) => (
              <li key={n.name} className="flex items-center justify-between">
                <Link href={namePath(n.name)} className="text-foreground hover:text-primary hover:underline">
                  {n.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(n.past)}
                  {n.pastSuppressed > 0 ? '+' : ''} ← {formatNumber(n.current)}
                  {n.currentSuppressed > 0 ? '+' : ''} (פי{' '}
                  {n.ratio >= 10 ? Math.round(n.ratio) : n.ratio.toFixed(1)})
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-red-700">דועכים ↓</h3>
          <ul className="space-y-1.5">
            {fallers.map((n) => (
              <li key={n.name} className="flex items-center justify-between">
                <Link href={namePath(n.name)} className="text-foreground hover:text-primary hover:underline">
                  {n.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(n.past)}
                  {n.pastSuppressed > 0 ? '+' : ''} ← {formatNumber(n.current)}
                  {n.currentSuppressed > 0 ? '+' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function TrendingPage() {
  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">השמות המזנקים והדועכים בישראל</h1>
      <p className="pb-4 text-muted-foreground">
        השוואה של ממוצע הנולדים בשנים {TREND_CURRENT[0]}–{TREND_CURRENT[1]} מול{' '}
        {TREND_PAST[0]}–{TREND_PAST[1]}, מנתוני הלמ״ס. שמות עם מעט מדי נולדים לא נכללים
        (הסף מותאם לגודל כל קבוצת אוכלוסייה), כדי שהרשימה תשקף מגמות אמיתיות ולא רעש.
        ממוצע עם + הוא ערך מינימלי: חלק משנות החלון מוסתרות על ידי הלמ״ס (פחות מ-5).
      </p>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <TrendTable gender="m" />
        <TrendTable gender="f" />
      </div>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">המזנק המוביל בכל קבוצת אוכלוסייה</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GROUPS.map((group) =>
            (['m', 'f'] as Gender[]).map((gender) => {
              const top = trendingNames(group, gender, 1).risers[0];
              if (!top) return null;
              return (
                <li key={`${group}-${gender}`} className="text-foreground">
                  {GROUP_LABELS[group]} · {GENDER_LABELS[gender]}:{' '}
                  <Link href={namePath(top.name)} className="font-semibold text-primary hover:underline">
                    {top.name}
                  </Link>{' '}
                  <span className="text-sm text-muted-foreground">
                    ({formatNumber(top.past)}
                    {top.pastSuppressed > 0 ? '+' : ''} ← {formatNumber(top.current)}
                    {top.currentSuppressed > 0 ? '+' : ''})
                  </span>
                </li>
              );
            }),
          )}
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">
        רוצים לראות איך מגמות כאלה נראות לאורך עשורים?{' '}
        <Link href="/stories" className="text-primary hover:underline">
          סיפורי השמות
        </Link>{' '}
        מראים מה להיט אחד יכול לעשות לשם שלם.
      </p>
    </div>
  );
}
