import Icon from './Icon';
import './LessonChart.css';

const NODE = 56;
const ROW_H = 110;
const PAD_X = 28;
const PAD_TOP = 40;
const PAD_BOTTOM = 30;
const X_PATTERN = [0.18, 0.5, 0.82, 0.5];

export default function LessonChart({ lessons, completedLessonIds, activeLessonId, unitUnlocked, onSelect }) {
  const n = lessons.length;
  const height = PAD_TOP + (n - 1) * ROW_H + PAD_BOTTOM + NODE;

  return (
    <div className="lesson-chart" style={{ height }}>
      <svg
        className="lesson-chart-svg"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-indigo)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-indigo)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {n > 1 && (
          <>
            <polygon
              points={
                lessons
                  .map((_, i) => `${X_PATTERN[i % X_PATTERN.length] * 100},${(PAD_TOP + i * ROW_H + NODE / 2)}`)
                  .join(' ') +
                ` ${X_PATTERN[(n - 1) % X_PATTERN.length] * 100},${height} ${X_PATTERN[0] * 100},${height}`
              }
              fill="url(#lc-area)"
            />
            <polyline
              points={lessons
                .map((_, i) => `${X_PATTERN[i % X_PATTERN.length] * 100},${(PAD_TOP + i * ROW_H + NODE / 2)}`)
                .join(' ')}
              fill="none"
              stroke="var(--color-indigo)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: 2.5 }}
            />
          </>
        )}
      </svg>

      {lessons.map((lesson, i) => {
        const completed = completedLessonIds.includes(lesson.id);
        const active = unitUnlocked && lesson.id === activeLessonId;
        const state = completed ? 'completed' : active ? 'active' : 'locked';
        const iconName = completed ? 'check' : active ? 'chart-line' : 'lock';
        const xPct = X_PATTERN[i % X_PATTERN.length] * 100;
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
