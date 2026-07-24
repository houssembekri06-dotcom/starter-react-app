import Icon from './Icon';
import './LessonChart.css';

export default function LessonChart({ lessons, completedLessonIds, activeLessonId, unitUnlocked, onSelect }) {
  const n = lessons.length;
  const AMP = 22; // percent of container width
  const STEP = Math.PI / 2; // quarter-turn per lesson → clean sine zig-zag
  const offsets = lessons.map((_, i) => AMP * Math.sin(i * STEP));

  // Smooth path through the same points, in a viewBox where y = index
  const pts = offsets.map((ox, i) => ({ x: 50 + ox, y: i + 0.5 }));
  let d = '';
  if (pts.length) {
    d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
  }

  return (
    <div className="lesson-chart">
      <svg
        className="lesson-chart-svg"
        viewBox={`0 0 100 ${Math.max(n, 1)}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={d}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="lesson-chart-stack">
        {lessons.map((lesson, i) => {
          const completed = completedLessonIds.includes(lesson.id);
          const active = unitUnlocked && lesson.id === activeLessonId;
          const state = completed ? 'completed' : active ? 'active' : 'locked';
          const iconName = completed ? 'check' : active ? 'chart-line' : 'lock';
          const iconSize = state === 'active' ? 40 : state === 'completed' ? 36 : 28;
          const iconColor = state === 'active' ? '#10B981' : state === 'locked' ? '#94A3B8' : '#FFFFFF';
          return (
            <div
              key={lesson.id}
              className="lesson-chart-slot"
              style={{ transform: `translateX(${offsets[i]}%)` }}
            >
              <button
                type="button"
                className={`lesson-chart-node lesson-chart-node--${state}`}
                onClick={() => state !== 'locked' && onSelect(lesson)}
                disabled={state === 'locked'}
                aria-label={`Leçon ${i + 1}: ${lesson.title}`}
              >
                {active && <span className="lesson-chart-badge">COMMENCER</span>}
                <Icon name={iconName} size={iconSize} stroke={2.6} color={iconColor} />
              </button>
              <span className={`lesson-chart-label lesson-chart-label--${state}`}>
                {lesson.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
