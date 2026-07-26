'use client';

import { useState } from 'react';
import GenderBar from '@/components/charts/GenderBar';
import TrendLine, { type TrendDataset } from '@/components/charts/TrendLine';
import {
  BOY_COLOR,
  GENDER_LABELS,
  GIRL_COLOR,
  GROUP_LABELS,
  SUPPRESSED,
} from '@/lib/constants';
import type { NameDetail } from '@/lib/data';

// Distinguish population groups by opacity when a name spans several
const GROUP_ALPHA: Record<string, number> = { jewish: 0.9, muslim: 0.65, christian: 0.45, druze: 0.3 };

function colorFor(gender: 'm' | 'f', group: string): string {
  const base = gender === 'm' ? BOY_COLOR : GIRL_COLOR;
  return base.replace(/[\d.]+\)$/, `${GROUP_ALPHA[group] ?? 0.7})`);
}

export default function NameCharts({ detail }: { detail: NameDetail }) {
  const [percent, setPercent] = useState(false);
  const multiGroup = detail.groups.length > 1;

  const datasets: TrendDataset[] = detail.series.map((s) => ({
    label: multiGroup
      ? `${GENDER_LABELS[s.gender]} ${GROUP_LABELS[s.group]}`
      : GENDER_LABELS[s.gender],
    color: colorFor(s.gender, s.group),
    values: percent ? s.shares : s.counts.map((v) => (v === SUPPRESSED ? null : v)),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="rounded-xl border border-border bg-card shadow-sm p-4 lg:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">השם {detail.name} לאורך השנים</h2>
          <button
            type="button"
            onClick={() => setPercent((v) => !v)}
            className="rounded bg-primary px-4 py-1.5 text-primary-foreground hover:bg-primary/90"
            aria-label={percent ? 'הצגת מספרים מוחלטים' : 'הצגת אחוזים'}
          >
            {percent ? '%' : '#'}
          </button>
        </div>
        <div className="h-80">
          <TrendLine
            datasets={datasets}
            percent={percent}
            title={
              percent
                ? 'אחוז מהנולדים בני אותו מגדר באותה קבוצת אוכלוסייה, בכל שנה'
                : 'מספר נולדים בכל שנה'
            }
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          קטעים חסרים בגרף הם שנים שבהן פחות מ-5 נולדים קיבלו את השם - הלמ״ס מסתירה ערכים אלו
          מטעמי פרטיות.
        </p>
      </section>
      <section className="rounded-xl border border-border bg-card shadow-sm p-4">
        <h2 className="mb-2 text-xl font-bold">בן או בת?</h2>
        <GenderBar name={detail.name} boys={detail.totalM} girls={detail.totalF} />
      </section>
    </div>
  );
}
