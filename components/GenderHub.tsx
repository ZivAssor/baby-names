import Link from 'next/link';
import {
  DEFAULT_RANGE,
  GENDER_LABELS,
  GROUP_LABELS,
  GROUPS,
  LAST_YEAR,
  namePath,
  type Gender,
} from '@/lib/constants';
import { allTimeTop, topNames, TREND_CURRENT, TREND_PAST, trendingNames } from '@/lib/data';
import { countDisplay, formatNumber } from '@/lib/format';

export default function GenderHub({ gender }: { gender: Gender }) {
  const label = GENDER_LABELS[gender];
  const current = topNames('jewish', gender, LAST_YEAR, LAST_YEAR, 10);
  const decade = topNames('jewish', gender, DEFAULT_RANGE.start, DEFAULT_RANGE.end, 10);
  const classics = allTimeTop(gender, 15);
  const { risers } = trendingNames('jewish', gender, 8);

  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">שמות ל{label === 'בנים' ? 'בן' : 'בת'} — כל הנתונים</h1>
      <p className="pb-4 text-muted-foreground">
        מחפשים שם ל{label === 'בנים' ? 'בן' : 'בת'}? כאן תמצאו את השמות המובילים עכשיו, הקלאסיקות
        של כל הזמנים והשמות שמתפרצים בדיוק ברגעים אלה — הכול מנתוני הלמ״ס, {LAST_YEAR}–1949.
      </p>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="mb-3 text-xl font-bold">המובילים ב-{LAST_YEAR}</h2>
          <ol className="list-inside list-decimal space-y-1">
            {current.map((n) => (
              <li key={n.name}>
                <Link href={namePath(n.name)} className="text-foreground hover:text-primary hover:underline">
                  {n.name}
                </Link>{' '}
                <span className="text-sm text-muted-foreground">{countDisplay(n)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="mb-3 text-xl font-bold">
            המובילים בעשור האחרון ({DEFAULT_RANGE.start}–{DEFAULT_RANGE.end})
          </h2>
          <ol className="list-inside list-decimal space-y-1">
            {decade.map((n) => (
              <li key={n.name}>
                <Link href={namePath(n.name)} className="text-foreground hover:text-primary hover:underline">
                  {n.name}
                </Link>{' '}
                <span className="text-sm text-muted-foreground">{countDisplay(n)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="mb-3 text-xl font-bold">הקלאסיקות של כל הזמנים</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            לפי מספר תושבי ישראל הנושאים את השם כיום, בכל קבוצות האוכלוסייה
          </p>
          <ul className="flex flex-wrap gap-2">
            {classics.map(({ name, total }) => (
              <li key={name}>
                <Link
                  href={namePath(name)}
                  className="inline-block rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-accent hover:text-primary"
                >
                  {name}
                  <span className="ms-1.5 text-xs text-muted-foreground">{formatNumber(total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="mb-3 text-xl font-bold">מתפרצים עכשיו</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            ממוצע {TREND_CURRENT[0]}–{TREND_CURRENT[1]} לעומת {TREND_PAST[0]}–{TREND_PAST[1]}
          </p>
          <ul className="space-y-1.5">
            {risers.map((n) => (
              <li key={n.name} className="flex items-center justify-between">
                <Link href={namePath(n.name)} className="text-foreground hover:text-primary hover:underline">
                  {n.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(n.past)}
                  {n.pastSuppressed > 0 ? '+' : ''} ← {formatNumber(n.current)}
                  {n.currentSuppressed > 0 ? '+' : ''} בשנה
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link href="/trending" className="text-primary hover:underline">
              לכל השמות המזנקים והדועכים ←
            </Link>
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">עוד דרכים למצוא שם</h2>
        <ul className="flex flex-wrap gap-3 text-primary">
          <li>
            <Link href="/unisex" className="hover:underline">
              שמות יוניסקס
            </Link>
          </li>
          <li>
            <Link href="/rare" className="hover:underline">
              שמות נדירים
            </Link>
          </li>
          <li>
            <Link href="/names" className="hover:underline">
              כל השמות לפי א״ב
            </Link>
          </li>
          <li>
            <Link href={`/year/${LAST_YEAR}`} className="hover:underline">
              השמות של {LAST_YEAR}
            </Link>
          </li>
          {GROUPS.filter((g) => g !== 'jewish').map((group) => (
            <li key={group}>
              <Link href={`/${group}`} className="hover:underline">
                שמות {GROUP_LABELS[group]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
