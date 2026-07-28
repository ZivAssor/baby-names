'use client';

import { useRouter } from 'next/navigation';
import NameSearch from '@/components/NameSearch';
import { namePath, type Group } from '@/lib/constants';
import { maskFor } from '@/lib/client-index';

/** The homepage's primary action: type your name, land on its page. */
export default function HeroSearch({ group }: { group?: Group }) {
  const router = useRouter();
  return (
    <div className="mx-auto mt-5 w-full max-w-md text-right">
      <NameSearch
        mask={maskFor(group)}
        onSelect={(name) => router.push(namePath(name))}
        placeholder="הקלידו שם ובדקו..."
        label="בדקו כמה אנשים נושאים את השם"
      />
    </div>
  );
}
