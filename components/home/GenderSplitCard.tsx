'use client';

import Link from 'next/link';
import GenderBar from '@/components/charts/GenderBar';
import NameSearch from '@/components/NameSearch';
import { namePath, type Group } from '@/lib/constants';
import { maskFor } from '@/lib/client-index';
import { formatNumber } from '@/lib/format';
import type { NameDetail } from '@/lib/data';
import { useNameDetail } from './useNameDetail';

interface GenderSplitCardProps {
  group: Group;
  initial: NameDetail;
}

/** Totals within the card's population group, by gender (exact CBS totals). */
function groupTotals(detail: NameDetail, group: Group): { boys: number; girls: number } {
  let boys = 0;
  let girls = 0;
  for (const s of detail.series) {
    if (s.group !== group) continue;
    if (s.gender === 'm') boys += s.total;
    else girls += s.total;
  }
  return { boys, girls };
}

export default function GenderSplitCard({ group, initial }: GenderSplitCardProps) {
  const { detail, loading, error, selectName } = useNameDetail(initial);
  const { boys, girls } = groupTotals(detail, group);

  return (
    <section className="relative w-full rounded-lg border bg-white p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">בן או בת?</h2>
      <NameSearch mask={maskFor(group)} onSelect={selectName} label="חיפוש שם להשוואת מגדר" />
      {error && <p className="mt-2 text-center text-sm text-red-600">שגיאה בטעינת הנתונים, נסו שוב</p>}
      <div className={loading ? 'opacity-50' : ''}>
        <GenderBar name={detail.name} boys={boys} girls={girls} />
        <div className="mt-4 border-t border-gray-200 p-4">
          <h3 className="mb-2 text-xl font-bold">
            <Link href={namePath(detail.name)} className="hover:text-blue-700 hover:underline">
              {detail.name}
            </Link>
          </h3>
          <p className="mb-1 text-gray-700">
            סה״כ בנים עם השם הזה: <strong>{formatNumber(boys)}</strong>
          </p>
          <p className="mb-1 text-gray-700">
            סה״כ בנות עם השם הזה: <strong>{formatNumber(girls)}</strong>
          </p>
          <p className="mt-3 text-sm text-gray-500">
            הנתונים כוללים את כל בעלי השם הרשומים במרשם האוכלוסין.{' '}
            <Link href={namePath(detail.name)} className="text-blue-700 hover:underline">
              לעמוד המלא של השם {detail.name} ←
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
