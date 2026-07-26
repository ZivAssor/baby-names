import Link from 'next/link';
import { GROUP_LABELS, GROUPS, groupPath, type Group } from '@/lib/constants';

export default function GroupTabs({ active }: { active: Group }) {
  return (
    <nav aria-label="קבוצת אוכלוסייה" className="flex flex-wrap justify-center gap-2 pt-4">
      {GROUPS.map((group) => (
        <Link
          key={group}
          href={groupPath(group)}
          aria-current={group === active ? 'page' : undefined}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            group === active
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
        >
          {GROUP_LABELS[group]}
        </Link>
      ))}
    </nav>
  );
}
