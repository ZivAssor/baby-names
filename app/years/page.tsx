import type { Metadata } from 'next';
import Link from 'next/link';
import { FIRST_YEAR, LAST_YEAR, SITE_NAME } from '@/lib/constants';
import { topNames } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'השמות הפופולריים לפי שנה',
  description: `השם המוביל לבנים ולבנות בכל שנה מ-${FIRST_YEAR} ועד ${LAST_YEAR} — לחצו על שנה לרשימה המלאה לפי מגדר וקבוצת אוכלוסייה. | ${SITE_NAME}`,
  canonical: '/years',
});

export default function YearsIndexPage() {
  const years = [];
  for (let year = LAST_YEAR; year >= FIRST_YEAR; year--) {
    years.push({
      year,
      topBoy: topNames('jewish', 'm', year, year, 1)[0]?.name ?? '—',
      topGirl: topNames('jewish', 'f', year, year, 1)[0]?.name ?? '—',
    });
  }

  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">השמות הפופולריים לפי שנה</h1>
      <p className="pb-4 text-muted-foreground">
        השם המוביל לבנים ולבנות (יהודים) בכל שנה. לחצו על שנה לרשימה המלאה, כולל כל קבוצות
        האוכלוסייה והמזנקים של אותה שנה.
      </p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-muted text-sm text-muted-foreground">
            <tr>
              <th className="p-3">שנה</th>
              <th className="p-3">השם המוביל לבנים</th>
              <th className="p-3">השם המוביל לבנות</th>
            </tr>
          </thead>
          <tbody>
            {years.map(({ year, topBoy, topGirl }) => (
              <tr key={year} className="border-t border-border hover:bg-accent/40">
                <td className="p-3">
                  <Link href={`/year/${year}`} className="font-semibold text-primary hover:underline">
                    {year}
                  </Link>
                </td>
                <td className="p-3">{topBoy}</td>
                <td className="p-3">{topGirl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
