'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaFemale, FaMale } from 'react-icons/fa';
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
        <li key={item.name} className="my-3 flex items-center rounded-lg bg-gray-50 p-2">
          <div className={`${bgClass} rounded-lg p-3`}>
            <Icon className={iconClass} aria-hidden />
          </div>
          <div className="flex w-full items-center justify-between pe-2 ps-4">
            <Link href={namePath(item.name)} className="text-gray-700 hover:text-blue-700 hover:underline">
              {item.name}
            </Link>
            <span className="text-sm text-gray-400">{countDisplay(item)}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="relative w-full rounded-lg border bg-white p-4">
      <h2 className="text-center text-2xl font-bold">
        {title}{' '}
        <button
          type="button"
          className="cursor-pointer text-blue-700 hover:underline"
          onClick={() => {
            setDraft(range);
            setPickerOpen((v) => !v);
          }}
        >
          {range.start}–{range.end}
        </button>
      </h2>
      <p className="mb-4 text-center text-sm text-gray-600">אפשר ללחוץ על השנים כדי לשנות אותן</p>

      {pickerOpen && (
        <div className="mb-4 flex flex-wrap items-end justify-center gap-3 rounded-lg bg-gray-50 p-3">
          <label className="text-sm">
            משנת
            <select
              className="ms-2 rounded border border-gray-300 p-1"
              value={draft.start}
              onChange={(e) => setDraft((d) => ({ ...d, start: Number(e.target.value) }))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            עד שנת
            <select
              className="ms-2 rounded border border-gray-300 p-1"
              value={draft.end}
              onChange={(e) => setDraft((d) => ({ ...d, end: Number(e.target.value) }))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={applyRange}
            className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
          >
            אישור
          </button>
        </div>
      )}

      {error && <p className="mb-2 text-center text-sm text-red-600">שגיאה בטעינת הנתונים, נסו שוב</p>}

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
        <p className="mt-2 text-xs text-gray-500">
          + פירושו ערך מינימלי: בחלק מהשנים הלמ״ס מסתירה ערכים הקטנים מ-5 מטעמי פרטיות.
        </p>
      )}
    </section>
  );
}
