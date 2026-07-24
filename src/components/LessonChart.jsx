import { useMemo } from 'react';
import Icon from './Icon';
import './LessonChart.css';

const NODE = 56;
const ROW_H = 110;
const PAD_X = 28;
const PAD_TOP = 40;
const PAD_BOTTOM = 30;
const X_MIN = 0.15;
const X_MAX = 0.85;

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

  return (
    <div className="lesson-chart" style={{ height }}>
      <svg
        className="lesson-chart-svg"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {n > 1 && (
          <polyline
            points={lessons
              .map((_, i) => `${xPositions[i] * 100},${PAD_TOP + i * ROW_H + NODE / 2}`)
              .join(' ')}
            fill="none"
            stroke="var(--color-indigo)"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 2.5 }}
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
