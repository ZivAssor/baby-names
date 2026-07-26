'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { filterIndex, loadIndex, maskFor, type IndexEntry } from '@/lib/client-index';
import { namePath } from '@/lib/constants';
import { formatNumber } from '@/lib/format';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** The actual command palette - loaded lazily so cmdk/dialog code is not in every route's initial bundle. */
export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    setError(false);
    loadIndex()
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  const results = index && query ? filterIndex(index, query, maskFor(), 12) : [];

  function choose(name: string) {
    onOpenChange(false);
    setQuery('');
    router.push(namePath(name));
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="חיפוש שם"
      description="הקלידו שם כדי לעבור לעמוד הסטטיסטיקות שלו"
    >
      <Command shouldFilter={false} dir="rtl">
        <CommandInput placeholder="הקלידו שם..." value={query} onValueChange={setQuery} />
        <CommandList>
          {error && <CommandEmpty>שגיאה בטעינת רשימת השמות</CommandEmpty>}
          {!error && index === null && open && <CommandEmpty>טוען שמות...</CommandEmpty>}
          {!error && index !== null && query && results.length === 0 && (
            <CommandEmpty>לא נמצאו שמות</CommandEmpty>
          )}
          {!error && !query && index !== null && (
            <CommandEmpty>התחילו להקליד שם בעברית</CommandEmpty>
          )}
          {results.map(([name, total]) => (
            <CommandItem key={name} value={name} onSelect={() => choose(name)}>
              <span>{name}</span>
              <span className="ms-auto text-xs text-muted-foreground">
                {formatNumber(total)} אנשים
              </span>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
