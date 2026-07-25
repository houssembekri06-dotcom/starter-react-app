import Icon from './Icon';
import './LessonPathNode.css';

export default function LessonPathNode({ label, state, offset = 0, onClick }) {
  const icon = state === 'completed' ? 'coin' : state === 'active' ? 'chart-line' : 'lock';

  return (
    <div className="path-node-wrap" style={{ transform: `translateX(${offset}px)` }}>
      {state === 'active' && <div className="path-node-badge">START</div>}
      <button
        className={`path-node path-node--${state}`}
        onClick={onClick}
        disabled={state === 'locked'}
        aria-label={label}
      >
        <span className="path-node-ring" />
        <span className="path-node-core">
          <Icon
            name={icon}
            size={state === 'active' ? 26 : 22}
            stroke={2.1}
            color={state === 'locked' ? 'var(--color-text-disabled)' : '#fff'}
          />
        </span>
      </button>
      <span className={`path-node-label${state === 'locked' ? ' path-node-label--locked' : ''}`}>
        {label}
      </span>
    </div>
  );
}
