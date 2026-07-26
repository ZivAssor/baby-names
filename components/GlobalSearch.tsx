'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

const SearchDialog = dynamic(() => import('@/components/SearchDialog'));

/** Site-wide name search trigger. The heavy dialog (cmdk + Base UI) loads on first open. */
export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  // Platform-correct shortcut hint, rendered only after mount (SSR-deterministic)
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    setHint(isMac ? '⌘K' : 'Ctrl+K');
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // e.code is layout-independent - with a Hebrew layout the K key reports e.key === 'ל'
      if ((e.metaKey || e.ctrlKey) && (e.code === 'KeyK' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setOpen((v) => !v);
        setEverOpened(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setEverOpened(true);
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent"
        aria-label="חיפוש שם"
      >
        <SearchIcon className="h-4 w-4" aria-hidden />
        <span>חיפוש שם...</span>
        {hint && (
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
            {hint}
          </kbd>
        )}
      </button>
      {everOpened && <SearchDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
