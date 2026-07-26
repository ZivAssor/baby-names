'use client';

import { Bar } from 'react-chartjs-2';
import { BOY_COLOR, GIRL_COLOR } from '@/lib/constants';
import { registerCharts } from './chart-setup';

registerCharts();

interface GenderBarProps {
  name: string;
  boys: number;
  girls: number;
}

export default function GenderBar({ name, boys, girls }: GenderBarProps) {
  return (
    <Bar
      data={{
        labels: [name],
        datasets: [
          { label: 'בנים', data: [boys], backgroundColor: BOY_COLOR, borderRadius: 6 },
          { label: 'בנות', data: [girls], backgroundColor: GIRL_COLOR, borderRadius: 6 },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: true, rtl: true } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#78716c' } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            border: { display: false },
            ticks: { color: '#78716c' },
          },
        },
      }}
    />
  );
}
