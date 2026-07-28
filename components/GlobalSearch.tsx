'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { loadIndex } from '@/lib/client-index';

const loadSearchDialog = () => import('@/components/SearchDialog');
// React.lazy + our own Suspense (not next/dynamic with `loading`): dynamic's
// fallback is prop-blind - it would cover the page whenever the chunk is
// pending, even after the dialog was closed, with no way to dismiss it.
const SearchDialog = lazy(loadSearchDialog);

/** Warm the dialog chunk + name index during the gesture, before the click handler runs. */
function warmSearch() {
  loadSearchDialog().catch(() => {
    // ignore - a failed warm just falls back to loading on open
  });
  loadIndex().catch(() => {
    // ignore here - SearchDialog's own load path surfaces the error and retries
  });
}

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
        warmSearch();
        setOpen((v) => !v);
        setEverOpened(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    // Warm the dialog chunk at browser idle so its download+eval never lands
    // inside the tap that opens search (the index stays gesture-triggered -
    // it is ~106KB gz and not every visitor searches).
    const warm = () => {
      loadSearchDialog().catch(() => {});
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <button
        type="button"
        onPointerDown={warmSearch}
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
      {everOpened && (
        <Suspense
          fallback={
            open ? (
              // Instant dimmed backdrop while the chunk loads; tap dismisses
              <div
                aria-hidden
                onClick={() => setOpen(false)}
                className="fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
              />
            ) : null
          }
        >
          <SearchDialog open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
