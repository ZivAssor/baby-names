import type { Metadata } from 'next';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import {
  GENDER_LABELS,
  GROUP_LABELS,
  GROUPS,
  LAST_YEAR,
  namePath,
  SITE_NAME,
  type Gender,
} from '@/lib/constants';
import { topNames, yearMovers } from '@/lib/data';
import { countDisplay, formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

// Evergreen headline page: always presents the newest year in the data, so it
// is ready the moment a new CBS file lands (the annual traffic wave) without
// touching this file.
export const metadata: Metadata = pageMetadata({
  title: `השמות הפופולריים בישראל - הרשימה המלאה של ${LAST_YEAR}`,
  description: `אלה השמות שניתנו הכי הרבה בישראל ב-${LAST_YEAR}: עשרת המובילים לבנים ולבנות, המובילים בכל קבוצת אוכלוסייה והשמות המזנקים - מנתוני הלמ״ס הרשמיים. | ${SITE_NAME}`,
  canonical: '/top-names',
});

function TopTen({ gender }: { gender: Gender }) {
  const names = topNames('jewish', gender, LAST_YEAR, LAST_YEAR, 10);
  return (
    <div>
      <h3 className={`mb-2 font-semibold ${gender === 'm' ? 'text-blue-600' : 'text-pink-600'}`}>
        {GENDER_LABELS[gender]}
      </h3>
      <ol className="list-inside list-decimal space-y-1">
        {names.map((n) => (
          <li key={n.name} className="text-foreground">
            <Link href={namePath(n.name)} className="hover:text-primary hover:underline">
              {n.name}
            </Link>{' '}
            <span className="text-sm text-muted-foreground">{countDisplay(n)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function TopNamesPage() {
  const topBoy = topNames('jewish', 'm', LAST_YEAR, LAST_YEAR, 1)[0];
  const topGirl = topNames('jewish', 'f', LAST_YEAR, LAST_YEAR, 1)[0];
  const movers = yearMovers(LAST_YEAR, 'jewish', 'm', 3);
  const moversF = yearMovers(LAST_YEAR, 'jewish', 'f', 3);

  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">השמות הפופולריים בישראל - {LAST_YEAR}</h1>
      <p className="pb-3 text-muted-foreground">
        הרשימה המלאה מנתוני הלשכה המרכזית לסטטיסטיקה: המובילים, המזנקים והמובילים בכל קבוצת
        אוכלוסייה.
      </p>
      <div className="pb-4">
        <ShareButton
          shareText={`השמות הפופולריים בישראל ב-${LAST_YEAR}: ${topBoy?.name} לבנים ו${topGirl?.name} לבנות 👶 הרשימה המלאה:`}
          path="/top-names"
        />
      </div>

      <section className="mb-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">עשרת השמות המובילים ב-{LAST_YEAR}</h2>
        <div className="grid grid-cols-2 gap-4">
          <TopTen gender="m" />
          <TopTen gender="f" />
        </div>
      </section>

      <section className="mb-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">השם המוביל בכל קבוצת אוכלוסייה</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GROUPS.map((group) =>
            (['m', 'f'] as Gender[]).map((gender) => {
              const top = topNames(group, gender, LAST_YEAR, LAST_YEAR, 1)[0];
              if (!top) return null;
              return (
                <li key={`${group}-${gender}`} className="text-foreground">
                  {GROUP_LABELS[group]} · {GENDER_LABELS[gender]}:{' '}
                  <Link href={namePath(top.name)} className="font-semibold text-primary hover:underline">
                    {top.name}
                  </Link>{' '}
                  <span className="text-sm text-muted-foreground">
                    ({formatNumber(top.count)} נולדים)
                  </span>
                </li>
              );
            }),
          )}
        </ul>
      </section>

      {(movers.risers.length > 0 || moversF.risers.length > 0) && (
        <section className="mb-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">המזנקים של {LAST_YEAR}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[...movers.risers, ...moversF.risers].map((m) => (
              <li key={m.name} className="text-foreground">
                <Link href={namePath(m.name)} className="hover:text-primary hover:underline">
                  {m.name}
                </Link>{' '}
                <span className="text-sm text-muted-foreground">
                  {m.previousSuppressed ? '1-4' : formatNumber(m.previous)} ←{' '}
                  {m.currentSuppressed ? '1-4' : formatNumber(m.current)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm text-sm text-muted-foreground">
        <h2 className="mb-2 text-base font-bold text-foreground">לעיתונאים וכותבים</h2>
        <p>
          הנתונים בעמוד זה מבוססים על קובץ השמות הפרטיים הרשמי של הלשכה המרכזית לסטטיסטיקה
          (ילידי 1949-{LAST_YEAR}), בעיבוד של {SITE_NAME}. אפשר לצטט בציון המקור. עוד:{' '}
          <Link href="/years" className="text-primary hover:underline">
            השמות המובילים בכל שנה מ-1949
          </Link>
          ,{' '}
          <Link href="/trending" className="text-primary hover:underline">
            השמות המזנקים והדועכים
          </Link>{' '}
          ו
          <Link href="/stories" className="text-primary hover:underline">
            סיפורי שמות מגובי נתונים
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
