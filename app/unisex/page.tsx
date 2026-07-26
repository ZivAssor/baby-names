import type { Metadata } from 'next';
import Link from 'next/link';
import { namePath, SITE_NAME } from '@/lib/constants';
import { unisexNames } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'שמות יוניסקס — שמות לבנים ולבנות',
  description: `השמות הדו-מגדריים המובילים בישראל: שמות שלפחות רבע מהנושאים אותם הם מהמגדר השני, לפי נתוני הלמ״ס. | ${SITE_NAME}`,
  canonical: '/unisex',
});

export default function UnisexPage() {
  const names = unisexNames(50);
  return (
    <div className="py-4">
      <h1 className="pb-1 text-3xl font-bold">שמות יוניסקס</h1>
      <p className="pb-4 text-gray-600">
        שמות שניתנים באופן משמעותי גם לבנים וגם לבנות (לפחות 25% מכל מגדר), מסודרים לפי מספר
        הנושאים אותם בישראל. הפס מציג את החלוקה בין בנים (כחול) לבנות (ורוד).
      </p>
      <section className="rounded-lg border bg-white p-6">
        <ul className="space-y-3">
          {names.map(({ name, totalM, totalF, totalAll }) => {
            const mShare = Math.round((totalM * 100) / (totalM + totalF));
            return (
              <li key={name} className="flex items-center gap-4">
                <Link
                  href={namePath(name)}
                  className="w-28 shrink-0 font-semibold text-gray-800 hover:text-blue-700 hover:underline"
                >
                  {name}
                </Link>
                <div
                  className="flex h-4 grow overflow-hidden rounded-full bg-gray-100"
                  role="img"
                  aria-label={`${name}: ${mShare}% בנים, ${100 - mShare}% בנות`}
                >
                  <div className="h-full bg-blue-400" style={{ width: `${mShare}%` }} />
                  <div className="h-full bg-pink-400" style={{ width: `${100 - mShare}%` }} />
                </div>
                <span className="w-28 shrink-0 text-left text-sm text-gray-400">
                  {formatNumber(totalAll)} · {mShare}%/{100 - mShare}%
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
