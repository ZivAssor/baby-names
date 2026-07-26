import type { Metadata } from 'next';
import Link from 'next/link';
import { letterPath, namePath, SITE_NAME } from '@/lib/constants';
import { getSearchIndex, letterIndex, siteTotals } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';
import { formatNumber } from '@/lib/format';

export const metadata: Metadata = pageMetadata({
  title: 'כל השמות לפי א״ב',
  description: `אינדקס כל השמות הפרטיים בישראל לפי סדר א״ב — כמעט 20,000 שמות מנתוני הלמ״ס, עם סטטיסטיקות מלאות לכל שם. | ${SITE_NAME}`,
  canonical: '/names',
});

export default function NamesIndexPage() {
  const letters = letterIndex();
  const popular = getSearchIndex().slice(0, 60);
  const totals = siteTotals();

  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">כל השמות לפי א״ב</h1>
      <p className="pb-4 text-muted-foreground">
        {formatNumber(totals.names)} שמות פרטיים מנתוני הלשכה המרכזית לסטטיסטיקה — לחצו על אות
        כדי לעיין, או על שם כדי לראות את הסטטיסטיקות המלאות שלו.
      </p>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">לפי אות</h2>
        <ul className="flex flex-wrap gap-2">
          {letters.map(({ letter, count }) => (
            <li key={letter}>
              <Link
                href={letterPath(letter)}
                className="inline-block rounded-lg bg-secondary px-4 py-2 text-lg font-semibold text-secondary-foreground hover:bg-accent hover:text-primary"
              >
                {letter}
                <span className="ms-1.5 text-xs font-normal text-muted-foreground/80">
                  {formatNumber(count)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">השמות הנפוצים בישראל</h2>
        <ul className="flex flex-wrap gap-2">
          {popular.map(([name, total]) => (
            <li key={name}>
              <Link
                href={namePath(name)}
                className="inline-block rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground hover:bg-accent hover:text-primary"
              >
                {name}
                <span className="ms-1.5 text-xs text-muted-foreground/80">{formatNumber(total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
