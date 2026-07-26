import { FIRST_YEAR, LAST_YEAR, type Group } from '@/lib/constants';
import { groupStats } from '@/lib/data';
import { formatNumber } from '@/lib/format';

export default function StatsCards({ group }: { group: Group }) {
  const stats = groupStats(group);
  const cards = [
    { value: formatNumber(stats.boyNames), label: 'שמות של בנים', color: 'text-blue-500' },
    { value: formatNumber(stats.girlNames), label: 'שמות של בנות', color: 'text-pink-500' },
    { value: `${FIRST_YEAR}–${LAST_YEAR}`, label: 'תקופת זמן', color: 'text-foreground' },
  ];
  return (
    <div className="grid gap-4 py-4 sm:grid-cols-3">
      {cards.map(({ value, label, color }) => (
        <div key={label} className="flex w-full flex-col rounded-xl border border-border bg-card shadow-sm p-4">
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
