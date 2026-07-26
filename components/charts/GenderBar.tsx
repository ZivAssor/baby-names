'use client';

// Server-renderable SVG bar chart for the boys/girls split (replaces Chart.js).
// Direct value labels are always visible, so no hover layer is needed.
import { BOY_COLOR, GIRL_COLOR } from '@/lib/constants';

interface GenderBarProps {
  name: string;
  boys: number;
  girls: number;
}

const W = 400;
const H = 240;
const MARGIN = { top: 34, right: 40, bottom: 30, left: 40 };
const BAR_WIDTH = 88;

function roundedTopBar(cx: number, yTop: number, yBase: number, width: number): string {
  const r = Math.min(6, Math.max(0, yBase - yTop));
  const x0 = cx - width / 2;
  const x1 = cx + width / 2;
  return [
    `M${x0},${yBase}`,
    `L${x0},${yTop + r}`,
    `Q${x0},${yTop} ${x0 + r},${yTop}`,
    `L${x1 - r},${yTop}`,
    `Q${x1},${yTop} ${x1},${yTop + r}`,
    `L${x1},${yBase}`,
    'Z',
  ].join(' ');
}

export default function GenderBar({ name, boys, girls }: GenderBarProps) {
  const max = Math.max(boys, girls, 1);
  const plotH = H - MARGIN.top - MARGIN.bottom;
  const yBase = H - MARGIN.bottom;
  const heightFor = (v: number) => (v / max) * plotH;

  const bars = [
    { label: 'בנים', value: boys, color: BOY_COLOR, cx: W * 0.32 },
    { label: 'בנות', value: girls, color: GIRL_COLOR, cx: W * 0.68 },
  ];

  return (
    <div dir="ltr" className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`בן או בת? ${name}: ${boys.toLocaleString('he-IL')} בנים, ${girls.toLocaleString('he-IL')} בנות`}
      >
        <line x1={MARGIN.left - 16} x2={W - MARGIN.right + 16} y1={yBase} y2={yBase} stroke="rgba(0,0,0,0.12)" />
        {bars.map(({ label, value, color, cx }) => {
          const h = heightFor(value);
          const yTop = yBase - h;
          return (
            <g key={label}>
              {value > 0 && <path d={roundedTopBar(cx, yTop, yBase, BAR_WIDTH)} fill={color} />}
              <text
                x={cx}
                y={(value > 0 ? yTop : yBase) - 8}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="#1c1917"
              >
                {value.toLocaleString('he-IL')}
              </text>
              <text x={cx} y={yBase + 20} textAnchor="middle" fontSize="13" fill="#78716c">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
