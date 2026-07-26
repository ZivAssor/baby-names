'use client';

import Link from 'next/link';
import { useState } from 'react';
import TrendLine from '@/components/charts/TrendLine';
import NameSearch from '@/components/NameSearch';
import { BOY_COLOR, GIRL_COLOR, namePath, SUPPRESSED, type Group } from '@/lib/constants';
import { maskFor } from '@/lib/client-index';
import type { NameDetail, SeriesDetail } from '@/lib/data';
import { useNameDetail } from './useNameDetail';

interface TrendCardProps {
  group: Group;
  initial: NameDetail;
}

function seriesFor(detail: NameDetail, group: Group, gender: 'm' | 'f'): SeriesDetail | null {
  return detail.series.find((s) => s.group === group && s.gender === gender) ?? null;
}

function toValues(series: SeriesDetail | null, percent: boolean): (number | null)[] {
  if (!series) return [];
  if (percent) return series.shares;
  return series.counts.map((v) => (v === SUPPRESSED ? null : v));
}

export default function TrendCard({ group, initial }: TrendCardProps) {
  const { detail, loading, error, selectName } = useNameDetail(initial);
  const [percent, setPercent] = useState(true);

  const boys = seriesFor(detail, group, 'm');
  const girls = seriesFor(detail, group, 'f');
  const datasets = [
    boys && { label: 'בנים', color: BOY_COLOR, values: toValues(boys, percent) },
    girls && { label: 'בנות', color: GIRL_COLOR, values: toValues(girls, percent) },
  ].filter(Boolean) as { label: string; color: string; values: (number | null)[] }[];

  return (
    <section className="relative flex h-[50vh] w-full flex-col rounded-lg border bg-white p-4 md:col-span-2 lg:h-[70vh]">
      <h2 className="mb-4 text-center text-2xl font-bold">שמות לאורך השנים</h2>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="grow">
          <NameSearch mask={maskFor(group)} onSelect={selectName} label="חיפוש שם למגמה לאורך השנים" />
        </div>
        <button
          type="button"
          onClick={() => setPercent((v) => !v)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          aria-label={percent ? 'הצגת מספרים מוחלטים' : 'הצגת אחוזים'}
        >
          {percent ? '%' : '#'}
        </button>
      </div>
      {error && <p className="text-center text-sm text-red-600">שגיאה בטעינת הנתונים, נסו שוב</p>}
      <div className={`min-h-0 grow ${loading ? 'opacity-50' : ''}`}>
        <TrendLine
          datasets={datasets}
          percent={percent}
          title={
            percent
              ? `אחוז הנולדים בשם ${detail.name} מהנולדים בני אותו מגדר באותה קבוצה, בכל שנה`
              : `מספר הנולדים בשם ${detail.name} בכל שנה`
          }
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        קטעים חסרים בגרף הם שנים שבהן פחות מ-5 נולדים קיבלו את השם (הלמ״ס מסתירה ערכים אלו).{' '}
        <Link href={namePath(detail.name)} className="text-blue-700 hover:underline">
          לעמוד המלא של השם {detail.name} ←
        </Link>
      </p>
    </section>
  );
}
