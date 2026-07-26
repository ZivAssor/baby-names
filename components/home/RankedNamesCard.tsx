'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaFemale, FaMale } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FIRST_YEAR, LAST_YEAR, namePath, type Group } from '@/lib/constants';
import { countDisplay } from '@/lib/format';
import type { RankedName } from '@/lib/data';

const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

export interface RankedPair {
  m: RankedName[];
  f: RankedName[];
}

interface RankedNamesCardProps {
  mode: 'top' | 'bottom';
  group: Group;
  initial: RankedPair;
  initialStart: number;
  initialEnd: number;
}

export default function RankedNamesCard({
  mode,
  group,
  initial,
  initialStart,
  initialEnd,
}: RankedNamesCardProps) {
  const [data, setData] = useState(initial);
  const [range, setRange] = useState({ start: initialStart, end: initialEnd });
  const [draft, setDraft] = useState(range);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestSeq = useRef(0);

  const title = mode === 'top' ? 'השמות הנפוצים ביותר' : 'השמות הנדירים ביותר';
  const anySuppressed = [...data.m, ...data.f].some((n) => n.suppressedYears > 0);

  async function applyRange() {
    const start = Math.min(draft.start, draft.end);
    const end = Math.max(draft.start, draft.end);
    const seq = ++requestSeq.current;
    setPickerOpen(false);
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `/api/ranked-names?group=${group}&start=${start}&end=${end}&order=${mode}`,
      );
      if (!res.ok) throw new Error(`ranked-names ${res.status}`);
      const payload = (await res.json()) as RankedPair;
      if (seq !== requestSeq.current) return; // superseded by a newer request
      setData(payload);
      setRange({ start, end });
    } catch {
      if (seq === requestSeq.current) setError(true);
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }

  const renderList = (names: RankedName[], Icon: typeof FaMale, iconClass: string, bgClass: string) => (
    <ul>
      {names.map((item) => (
        <li key={item.name} className="my-3 flex items-center rounded-lg bg-muted/60 p-2">
          <div className={`${bgClass} rounded-lg p-3`}>
            <Icon className={iconClass} aria-hidden />
          </div>
          <div className="flex w-full items-center justify-between pe-2 ps-4">
            <Link href={namePath(item.name)} className="text-foreground/90 hover:text-primary hover:underline">
              {item.name}
            </Link>
            <span className="text-sm text-muted-foreground/80">{countDisplay(item)}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="relative w-full rounded-xl border border-border bg-card shadow-sm p-4">
      <h2 className="text-center text-2xl font-bold">
        {title}{' '}
        <button
          type="button"
          className="cursor-pointer text-primary hover:underline"
          onClick={() => {
            setDraft(range);
            setPickerOpen((v) => !v);
          }}
        >
          {range.start}–{range.end}
        </button>
      </h2>
      <p className="mb-4 text-center text-sm text-muted-foreground">אפשר ללחוץ על השנים כדי לשנות אותן</p>

      {pickerOpen && (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-muted/60 p-3">
          <div className="flex items-center gap-2 text-sm">
            <span>משנת</span>
            <Select
              value={String(draft.start)}
              onValueChange={(v) => setDraft((d) => ({ ...d, start: Number(v) }))}
            >
              <SelectTrigger className="w-24" aria-label="שנת התחלה">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>עד שנת</span>
            <Select
              value={String(draft.end)}
              onValueChange={(v) => setDraft((d) => ({ ...d, end: Number(v) }))}
            >
              <SelectTrigger className="w-24" aria-label="שנת סיום">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={applyRange}>
            אישור
          </Button>
        </div>
      )}

      {error && <p className="mb-2 text-center text-sm text-destructive">שגיאה בטעינת הנתונים, נסו שוב</p>}

      <div className={`grid grid-cols-2 gap-4 ${loading ? 'opacity-50' : ''}`}>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-blue-600">בנים</h3>
          {renderList(data.m, FaMale, 'text-blue-800', 'bg-blue-100')}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-pink-600">בנות</h3>
          {renderList(data.f, FaFemale, 'text-pink-800', 'bg-pink-100')}
        </div>
      </div>

      {anySuppressed && (
        <p className="mt-2 text-xs text-muted-foreground">
          + פירושו ערך מינימלי: בחלק מהשנים הלמ״ס מסתירה ערכים הקטנים מ-5 מטעמי פרטיות.
        </p>
      )}
    </section>
  );
}
