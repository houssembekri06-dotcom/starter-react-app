import { useMemo } from 'react';
import Icon from './Icon';
import './LessonChart.css';

const NODE = 56;
const ROW_H = 110;
const PAD_X = 28;
const PAD_TOP = 40;
const PAD_BOTTOM = 30;
const X_MIN = 0.22;
const X_MAX = 0.88;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildSkylinePath(height) {
  // Generates a repeating New-York-style building silhouette across the chart.
  // Coordinates are in the 0-100 x / 0-height y viewBox space.
  const buildings = [
    { x: 0, w: 10, h: 14, roof: 1 },
    { x: 9, w: 8, h: 22, roof: 2 },
    { x: 16, w: 11, h: 10, roof: 0 },
    { x: 26, w: 7, h: 28, roof: 3 },
    { x: 32, w: 10, h: 16, roof: 1 },
    { x: 41, w: 9, h: 20, roof: 2 },
    { x: 49, w: 12, h: 12, roof: 0 },
    { x: 60, w: 8, h: 26, roof: 3 },
    { x: 67, w: 10, h: 15, roof: 1 },
    { x: 76, w: 9, h: 19, roof: 2 },
    { x: 84, w: 8, h: 11, roof: 0 },
    { x: 91, w: 9, h: 24, roof: 3 },
  ];

  let d = '';
  const floorY = height - 4;
  for (const b of buildings) {
    const roofY = floorY - b.h;
    let roof = '';
    if (b.roof === 1) {
      // flat with antenna
      roof = `M ${b.x} ${roofY} L ${b.x + b.w / 2} ${roofY - 4} L ${b.x + b.w} ${roofY}`;
    } else if (b.roof === 2) {
      // peaked
      roof = `L ${b.x + b.w / 2} ${roofY - 5} L ${b.x + b.w} ${roofY}`;
    } else if (b.roof === 3) {
      // stepped
      roof = `L ${b.x + 2} ${roofY - 3} L ${b.x + 2} ${roofY - 6} L ${b.x + b.w - 2} ${roofY - 6} L ${b.x + b.w - 2} ${roofY - 3} L ${b.x + b.w} ${roofY}`;
    } else {
      // flat
      roof = `L ${b.x + b.w} ${roofY}`;
    }
    d += `M ${b.x} ${floorY} V ${roofY} ${roof} V ${floorY} Z `;
  }
  return d;
}

export default function LessonChart({ lessons, completedLessonIds, activeLessonId, unitUnlocked, onSelect }) {
  const n = lessons.length;
  const height = PAD_TOP + (n - 1) * ROW_H + PAD_BOTTOM + NODE;

  const xPositions = useMemo(() => {
    const seed = hashString(lessons[0]?.unitId || lessons[0]?.id || 'seed');
    const rand = mulberry32(seed);
    const out = [];
    let prev = 0.5;
    for (let i = 0; i < n; i++) {
      let next;
      let tries = 0;
      do {
        next = X_MIN + rand() * (X_MAX - X_MIN);
        tries++;
      } while (Math.abs(next - prev) < 0.22 && tries < 8);
      out.push(next);
      prev = next;
    }
    return out;
  }, [lessons, n]);

  const points = lessons.map((_, i) => ({
    x: xPositions[i] * 100,
    y: PAD_TOP + i * ROW_H + NODE / 2,
  }));

  const pathD = useMemo(() => {
    if (points.length < 2) return '';
    const tension = 1.2;
    const k = tension / 6;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) * k;
      const cp1y = p1.y + (p2.y - p0.y) * k;
      const cp2x = p2.x - (p3.x - p1.x) * k;
      const cp2y = p2.y - (p3.y - p1.y) * k;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  return (
    <div className="lesson-chart" style={{ height }}>
      <svg
        className="lesson-chart-svg"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* New York skyline silhouette */}
        <g className="lesson-chart-skyline">
          <path d={buildSkylinePath(height)} />
        </g>

        {/* Finance-style grid */}
        {Array.from({ length: Math.ceil(height / 60) }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            x2="100"
            y1={i * 60}
            y2={i * 60}
            stroke="rgba(15, 23, 42, 0.08)"
            strokeDasharray="2 4"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 1 }}
          />
        ))}
        {[20, 40, 60, 80].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            x2={x}
            y1="0"
            y2={height}
            stroke="rgba(15, 23, 42, 0.04)"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 1 }}
          />
        ))}
        {n > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-indigo)"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 4.5 }}
          />
        )}
      </svg>

      {lessons.map((lesson, i) => {
        const completed = completedLessonIds.includes(lesson.id);
        const active = unitUnlocked && lesson.id === activeLessonId;
        const state = completed ? 'completed' : active ? 'active' : 'locked';
        const iconName = completed ? 'check' : active ? 'chart-line' : 'lock';
        const xPct = xPositions[i] * 100;
        const top = PAD_TOP + i * ROW_H;
        return (
          <div
            key={lesson.id}
            className="lesson-chart-slot"
            style={{ top, left: `calc(${xPct}% - ${NODE / 2}px)` }}
          >
            {active && <div className="lesson-chart-badge">COMMENCER</div>}
            <button
              type="button"
              className={`lesson-chart-node lesson-chart-node--${state}`}
              onClick={() => state !== 'locked' && onSelect(lesson)}
              disabled={state === 'locked'}
              aria-label={`Leçon ${i + 1}`}
            >
              <Icon name={iconName} size={24} stroke={2.4} color="#fff" />
            </button>
            <span className={`lesson-chart-label lesson-chart-label--${state}`}>
              Leçon {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
