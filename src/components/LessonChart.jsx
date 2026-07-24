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

  const areaPoints =
    n > 1
      ? `${X_MIN * 100},${points[0].y} ` +
        points.map((p) => `${p.x},${p.y}`).join(' ') +
        ` ${X_MIN * 100},${points[n - 1].y}`
      : '';

  return (
    <div className="lesson-chart" style={{ height }}>
      <div className="lesson-chart-axis" aria-hidden="true">
        {Array.from({ length: n }).map((_, i) => {
          const price = (100 + (n - i) * 4.25).toFixed(2);
          return (
            <span key={i} className="lesson-chart-axis-tick" style={{ top: PAD_TOP + i * ROW_H + NODE / 2 - 6 }}>
              {price}
            </span>
          );
        })}
      </div>
      <svg
        className="lesson-chart-svg"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lc-bull-area" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(22, 163, 74, 0)" />
            <stop offset="100%" stopColor="rgba(22, 163, 74, 0.22)" />
          </linearGradient>
          <linearGradient id="lc-bull-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#0e7c39" />
          </linearGradient>
        </defs>
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
          <polygon
            points={areaPoints}
            fill="url(#lc-bull-area)"
          />
        )}
        {n > 1 && (
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="url(#lc-bull-line)"
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
