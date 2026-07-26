'use client';

import TrendLine from '@/components/charts/TrendLine';
import { BOY_COLOR, FIRST_YEAR, GIRL_COLOR, SUPPRESSED, type Gender } from '@/lib/constants';

interface StoryChartProps {
  name: string;
  gender: Gender;
  /** yearly counts, index 0 = FIRST_YEAR, -1 = suppressed */
  counts: number[];
  eventYear: number;
  eventLabel: string;
}

export default function StoryChart({ name, gender, counts, eventYear, eventLabel }: StoryChartProps) {
  const values = counts.map((v) => (v === SUPPRESSED ? null : v));
  const eventValues = counts.map((v, i) =>
    FIRST_YEAR + i === eventYear && v !== SUPPRESSED ? v : null,
  );

  return (
    <div>
      <div className="h-80">
        <TrendLine
          percent={false}
          datasets={[
            {
              label: `נולדים בשם ${name} בכל שנה`,
              color: gender === 'm' ? BOY_COLOR : GIRL_COLOR,
              values,
            },
            {
              label: eventLabel,
              color: 'rgba(245, 158, 11, 1)',
              values: eventValues,
              pointRadius: 7,
            },
          ]}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {counts[eventYear - FIRST_YEAR] === SUPPRESSED
          ? `${eventYear} - ${eventLabel}. `
          : `הנקודה הכתומה מסמנת את ${eventYear} - ${eventLabel}. `}
        קטעים חסרים הם שנים עם פחות מ-5 נולדים (מוסתר על ידי הלמ״ס).
      </p>
    </div>
  );
}
