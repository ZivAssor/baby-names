'use client';

import { Line } from 'react-chartjs-2';
import { FIRST_YEAR, LAST_YEAR } from '@/lib/constants';
import { registerCharts } from './chart-setup';

registerCharts();

const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

export interface TrendDataset {
  label: string;
  color: string;
  /** one value per year from FIRST_YEAR; null = suppressed (rendered as a gap) */
  values: (number | null)[];
  /** override point radius (e.g. a single highlighted event point) */
  pointRadius?: number;
}

interface TrendLineProps {
  datasets: TrendDataset[];
  percent: boolean;
  title?: string;
}

export default function TrendLine({ datasets, percent, title }: TrendLineProps) {
  return (
    <Line
      data={{
        labels: YEARS,
        datasets: datasets.map(({ label, color, values, pointRadius }) => ({
          label,
          data: values,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          spanGaps: false,
          ...(pointRadius !== undefined ? { pointRadius, pointHoverRadius: pointRadius + 2 } : {}),
        })),
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', rtl: true },
          title: title ? { display: true, text: title } : undefined,
          tooltip: {
            rtl: true,
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${
                  percent ? `${(ctx.parsed.y as number).toFixed(2)}%` : ctx.parsed.y
                }`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#78716c', maxTicksLimit: 12 },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            border: { display: false },
            ticks: {
              color: '#78716c',
              callback: (value) => (percent ? `${Number(value).toFixed(2)}%` : value),
            },
          },
        },
        elements: { point: { radius: 2 } },
      }}
    />
  );
}
