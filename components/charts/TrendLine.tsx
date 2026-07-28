'use client';

// Server-renderable SVG line chart (replaces Chart.js). Because client
// components are still SSR'd, the full SVG - including every data point -
// ships in the initial HTML: crawlers and AI assistants can read the chart,
// and rendering is identical in every browser. A thin pointer layer adds a
// crosshair + tooltip after hydration.
import { useEffect, useMemo, useRef, useState } from 'react';
import { FIRST_YEAR, LAST_YEAR } from '@/lib/constants';

const YEAR_COUNT = LAST_YEAR - FIRST_YEAR + 1;
const MARGIN = { top: 26, right: 14, bottom: 30, left: 52 };

export interface TrendDataset {
  label: string;
  color: string;
  /** one value per year from FIRST_YEAR; null = suppressed (rendered as a gap) */
  values: (number | null)[];
  /** override point radius (e.g. a single highlighted event point) */
  pointRadius?: number;
}

interface TrendLineProps {
  datasets: TrendDataset[];
  percent: boolean;
  title?: string;
}

function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]) {
    if (value <= step * power) return step * power;
  }
  return 10 * power;
}

function formatTick(value: number, percent: boolean): string {
  if (percent) return `${value < 1 ? value.toFixed(2) : value.toFixed(1)}%`;
  if (value >= 1000) return `${(value / 1000).toLocaleString('he-IL')}K`;
  return value.toLocaleString('he-IL');
}

function formatValue(value: number, percent: boolean): string {
  if (percent) return `${value.toFixed(2)}%`;
  return value.toLocaleString('he-IL');
}

export default function TrendLine({ datasets, percent, title }: TrendLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [size, setSize] = useState({ w: 800, h: 380 });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      rectRef.current = null;
      if (width > 40 && height > 40) setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const plotW = size.w - MARGIN.left - MARGIN.right;
  const plotH = size.h - MARGIN.top - MARGIN.bottom;

  // Memoized so hover re-renders (per pointer frame) don't rebuild every path string
  const { yMax, paths } = useMemo(() => {
    const maxValue = Math.max(
      1e-9,
      ...datasets.flatMap((d) => d.values.filter((v): v is number => v !== null && v !== undefined)),
    );
    const max = niceCeil(maxValue * 1.05);
    const xAt = (yearIdx: number) => MARGIN.left + (yearIdx / (YEAR_COUNT - 1)) * plotW;
    const yAt = (value: number) => MARGIN.top + plotH - (value / max) * plotH;

    // Build path segments per dataset, broken at suppressed (null) years
    const built = datasets.map((d) => {
      const segments: string[] = [];
      let current: string[] = [];
      d.values.forEach((v, i) => {
        if (v === null || v === undefined) {
          if (current.length > 1) segments.push(current.join(' '));
          current = [];
        } else {
          current.push(
            `${current.length === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`,
          );
        }
      });
      if (current.length > 1) segments.push(current.join(' '));
      return segments.join(' ');
    });
    return { yMax: max, paths: built };
  }, [datasets, plotW, plotH]);

  const x = (yearIdx: number) => MARGIN.left + (yearIdx / (YEAR_COUNT - 1)) * plotW;
  const y = (value: number) => MARGIN.top + plotH - (value / yMax) * plotH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax);
  const xTickYears: number[] = [];
  for (let year = 1950; year <= LAST_YEAR; year += 10) xTickYears.push(year);

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    // Rect is cached per gesture (refreshed on pointerenter, cleared on resize):
    // getBoundingClientRect on every move forces a reflow right after the
    // previous hover commit dirtied layout. Vertical scroll only shifts
    // rect.top, which is unused - only left/width matter here.
    const rect =
      rectRef.current ?? (rectRef.current = e.currentTarget.getBoundingClientRect());
    const px = ((e.clientX - rect.left) / rect.width) * size.w;
    const idx = Math.round(((px - MARGIN.left) / plotW) * (YEAR_COUNT - 1));
    setHoverIdx(idx >= 0 && idx < YEAR_COUNT ? idx : null);
  }

  const hoverOnRightHalf = hoverIdx !== null && hoverIdx > YEAR_COUNT / 2;

  return (
    <div ref={containerRef} dir="ltr" className="relative h-full w-full">
      {(title || datasets.length >= 2) && (
        <div
          dir="rtl"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 px-2 text-xs text-muted-foreground"
        >
          {title && <span className="font-medium">{title}</span>}
          {datasets.length >= 2 &&
            datasets.map((d) => (
              <span key={d.label} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: d.color }}
                />
                {d.label}
              </span>
            ))}
        </div>
      )}
      <svg
        viewBox={`0 0 ${size.w} ${size.h}`}
        width="100%"
        height="100%"
        role="img"
        aria-label={title ?? 'גרף מגמה לאורך השנים'}
        onPointerEnter={(e) => {
          rectRef.current = e.currentTarget.getBoundingClientRect();
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHoverIdx(null)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={size.w - MARGIN.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="rgba(0,0,0,0.06)"
            />
            <text
              x={MARGIN.left - 8}
              y={y(tick) + 3.5}
              textAnchor="end"
              fontSize="11"
              fill="#78716c"
            >
              {formatTick(tick, percent)}
            </text>
          </g>
        ))}
        {xTickYears.map((year) => (
          <text
            key={year}
            x={x(year - FIRST_YEAR)}
            y={size.h - MARGIN.bottom + 18}
            textAnchor="middle"
            fontSize="11"
            fill="#78716c"
          >
            {year}
          </text>
        ))}

        {hoverIdx !== null && (
          <line
            x1={x(hoverIdx)}
            x2={x(hoverIdx)}
            y1={MARGIN.top}
            y2={size.h - MARGIN.bottom}
            stroke="rgba(0,0,0,0.18)"
            strokeDasharray="3 3"
          />
        )}

        {datasets.map((d, di) =>
          paths[di] ? (
            <path
              key={d.label}
              d={paths[di]}
              fill="none"
              stroke={d.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null,
        )}

        {datasets.map((d) =>
          d.values.map((v, i) => {
            if (v === null || v === undefined) return null;
            const highlighted = d.pointRadius !== undefined;
            const hovered = hoverIdx === i;
            if (!highlighted && !hovered) return null;
            return (
              <circle
                key={`${d.label}-${i}`}
                cx={x(i)}
                cy={y(v)}
                r={d.pointRadius ?? 4}
                fill={d.color}
                stroke="#fff"
                strokeWidth={highlighted ? 2 : 1.5}
              />
            );
          }),
        )}
      </svg>

      {hoverIdx !== null && (
        <div
          dir="rtl"
          className="pointer-events-none absolute z-20 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md"
          style={{
            top: MARGIN.top + 8,
            ...(hoverOnRightHalf
              ? { right: size.w - x(hoverIdx) + 10 }
              : { left: x(hoverIdx) + 10 }),
          }}
        >
          <div className="mb-1 font-semibold text-foreground">{FIRST_YEAR + hoverIdx}</div>
          {datasets
            .filter((d) => d.pointRadius === undefined)
            .map((d) => {
              const v = d.values[hoverIdx];
              return (
                <div key={d.label} className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span>{d.label}:</span>
                  <span className="font-medium text-foreground">
                    {v === null || v === undefined ? 'פחות מ-5' : formatValue(v, percent)}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
