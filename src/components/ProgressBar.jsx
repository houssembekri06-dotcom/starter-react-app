export default function ProgressBar({ value, max, tone = 'indigo', height = 8 }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="progress-bar" style={{ height }}>
      <div className={`progress-bar-fill progress-bar-fill--${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
