import Icon from './Icon';
import './LessonChart.css';

const OFFSETS = ['c', 'r', 'l', 'r', 'l'];

export default function LessonChart({ lessons, completedLessonIds, activeLessonId, unitUnlocked, onSelect }) {
  return (
    <div className="lesson-chart">
      <svg
        className="lesson-chart-svg"
        viewBox="0 0 100 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 50 20 Q 75 100 50 180 T 50 340 T 50 500 T 50 660"
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
          const offset = OFFSETS[i % OFFSETS.length];
          return (
            <div key={lesson.id} className="lesson-chart-slot" data-offset={offset}>
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
