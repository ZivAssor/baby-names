'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
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

/** Site-wide name search: a ⌘K command dialog over all ~19,900 names. */
export default function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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
    setOpen(false);
    setQuery('');
    router.push(namePath(name));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent"
        aria-label="חיפוש שם"
      >
        <SearchIcon className="h-4 w-4" aria-hidden />
        <span>חיפוש שם...</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
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
    </>
  );
}
