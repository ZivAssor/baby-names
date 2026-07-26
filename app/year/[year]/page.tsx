import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FIRST_YEAR,
  GENDER_LABELS,
  GROUP_LABELS,
  GROUPS,
  LAST_YEAR,
  namePath,
  type Gender,
} from '@/lib/constants';
import { topNames, yearBirths, yearMovers } from '@/lib/data';
import { countDisplay, formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => ({
    year: String(FIRST_YEAR + i),
  }));
}

function parseYear(raw: string): number | null {
  const year = Number(raw);
  if (!Number.isInteger(year) || year < FIRST_YEAR || year > LAST_YEAR) return null;
  return year;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year: rawYear } = await params;
  const year = parseYear(rawYear);
  if (year === null) return { title: 'שנה לא נמצאה' };
  const topBoy = topNames('jewish', 'm', year, year, 1)[0]?.name;
  const topGirl = topNames('jewish', 'f', year, year, 1)[0]?.name;
  return pageMetadata({
    title: `השמות הפופולריים בישראל ב-${year}`,
    description: `אילו שמות נתנו הורים בישראל לילדים שנולדו ב-${year}? ${
      topBoy && topGirl ? `בראש הרשימה: ${topBoy} ו${topGirl}. ` : ''
    }הרשימה המלאה לפי מגדר וקבוצת אוכלוסייה, מנתוני הלמ״ס.`,
    canonical: `/year/${year}`,
  });
}

function TopList({
  year,
  group,
  gender,
  limit,
}: {
  year: number;
  group: (typeof GROUPS)[number];
  gender: Gender;
  limit: number;
}) {
  const names = topNames(group, gender, year, year, limit);
  if (names.length === 0) return <p className="text-sm text-muted-foreground">אין נתונים זמינים</p>;
  return (
    <ol className="list-inside list-decimal space-y-1">
      {names.map((n) => (
        <li key={n.name} className="text-foreground">
          <Link href={namePath(n.name)} className="hover:text-primary hover:underline">
            {n.name}
          </Link>{' '}
          <span className="text-sm text-muted-foreground/80">{countDisplay(n)}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: rawYear } = await params;
  const year = parseYear(rawYear);
  if (year === null) notFound();

  const births = yearBirths(year);
  const totalVisible = births.reduce((acc, b) => acc + b.m + b.f, 0);
  const movers = yearMovers(year, 'jewish', 'm', 5);
  const moversF = yearMovers(year, 'jewish', 'f', 5);

  return (
    <div className="py-4">
      <nav aria-label="פירורי לחם" className="pb-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          ראשי
        </Link>{' '}
        ›{' '}
        <Link href="/years" className="hover:underline">
          שמות לפי שנה
        </Link>{' '}
        › <span className="text-foreground/90">{year}</span>
      </nav>

      <h1 className="pb-1 text-3xl font-bold">השמות הפופולריים בישראל ב-{year}</h1>
      <p className="pb-4 text-muted-foreground">
        בשנת {year} נולדו בישראל לפחות {formatNumber(totalVisible)} תינוקות ששמם מופיע
        בנתוני הלמ״ס. אלו השמות שבחרו ההורים.
      </p>

      <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
        <h2 className="mb-3 text-xl font-bold">עשרת השמות המובילים — יהודים</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 font-semibold text-blue-600">בנים</h3>
            <TopList year={year} group="jewish" gender="m" limit={10} />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-pink-600">בנות</h3>
            <TopList year={year} group="jewish" gender="f" limit={10} />
          </div>
        </div>
      </section>

      <section className="mb-4 grid gap-4 md:grid-cols-3">
        {GROUPS.filter((g) => g !== 'jewish').map((group) => (
          <div key={group} className="rounded-xl border border-border bg-card shadow-sm p-6">
            <h2 className="mb-3 text-lg font-bold">{GROUP_LABELS[group]}</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['m', 'f'] as Gender[]).map((gender) => (
                <div key={gender}>
                  <h3 className={`mb-1 text-sm font-semibold ${gender === 'm' ? 'text-blue-600' : 'text-pink-600'}`}>
                    {GENDER_LABELS[gender]}
                  </h3>
                  <TopList year={year} group={group} gender={gender} limit={5} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {(movers.risers.length > 0 || moversF.risers.length > 0) && (
        <section className="mb-4 rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="mb-3 text-xl font-bold">המזנקים של {year} לעומת {year - 1} — יהודים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 font-semibold text-blue-600">בנים</h3>
              <ul className="space-y-1">
                {movers.risers.map((m) => (
                  <li key={m.name} className="text-foreground">
                    <Link href={namePath(m.name)} className="hover:text-primary hover:underline">
                      {m.name}
                    </Link>{' '}
                    <span className="text-sm text-muted-foreground/80">
                      {m.previousSuppressed ? '1–4' : formatNumber(m.previous)} ←{' '}
                      {m.currentSuppressed ? '1–4' : formatNumber(m.current)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-pink-600">בנות</h3>
              <ul className="space-y-1">
                {moversF.risers.map((m) => (
                  <li key={m.name} className="text-foreground">
                    <Link href={namePath(m.name)} className="hover:text-primary hover:underline">
                      {m.name}
                    </Link>{' '}
                    <span className="text-sm text-muted-foreground/80">
                      {m.previousSuppressed ? '1–4' : formatNumber(m.previous)} ←{' '}
                      {m.currentSuppressed ? '1–4' : formatNumber(m.current)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <nav className="flex justify-between text-primary">
        {year > FIRST_YEAR ? (
          <Link href={`/year/${year - 1}`} className="hover:underline">
            → {year - 1}
          </Link>
        ) : (
          <span />
        )}
        {year < LAST_YEAR ? (
          <Link href={`/year/${year + 1}`} className="hover:underline">
            {year + 1} ←
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
