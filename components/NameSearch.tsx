'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { filterIndex, loadIndex, type IndexEntry } from '@/lib/client-index';

interface NameSearchProps {
  mask: number;
  onSelect: (name: string) => void;
  placeholder?: string;
  label: string;
}

export default function NameSearch({ mask, onSelect, placeholder, label }: NameSearchProps) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

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

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const results = index && query ? filterIndex(index, query, mask) : [];
  const expanded = open && query.length > 0;

  function choose(name: string) {
    onSelect(name);
    setQuery('');
    setOpen(false);
    setActiveIdx(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!expanded || results.length === 0) {
      if (e.key === 'Escape') setOpen(false);
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
        break;
      case 'Enter':
        if (activeIdx >= 0 && activeIdx < results.length) {
          e.preventDefault();
          choose(results[activeIdx][0]);
        }
        break;
      case 'Escape':
        setOpen(false);
        setActiveIdx(-1);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeIdx >= 0 ? `${listboxId}-${activeIdx}` : undefined}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? 'הקלידו שם...'}
        aria-label={label}
        className="w-full rounded-lg border border-input px-3 py-2 focus:border-ring focus:outline-none"
      />
      {expanded && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-card shadow-lg"
        >
          {error && <li className="px-3 py-2 text-sm text-destructive">שגיאה בטעינת רשימת השמות</li>}
          {!error && index === null && (
            <li className="px-3 py-2 text-sm text-muted-foreground">טוען שמות...</li>
          )}
          {!error && index !== null && results.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">לא נמצאו שמות</li>
          )}
          {results.map(([name], i) => (
            <li
              key={name}
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={i === activeIdx}
            >
              <button
                type="button"
                tabIndex={-1}
                className={`w-full px-3 py-2 text-right hover:bg-accent ${
                  i === activeIdx ? 'bg-accent' : ''
                }`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => choose(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
