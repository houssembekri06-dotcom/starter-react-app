import Icon from './Icon';
import './LessonVisual.css';

function Pie({ segments }) {
  const R = 62, C = 70;
  let acc = 0;
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div className="lv-pie-wrap">
      <svg viewBox="0 0 140 140" className="lv-pie">
        {segments.map((s, i) => {
          const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += s.value;
          const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
          const x1 = C + R * Math.cos(start), y1 = C + R * Math.sin(start);
          const x2 = C + R * Math.cos(end), y2 = C + R * Math.sin(end);
          const large = s.value / total > 0.5 ? 1 : 0;
          return (
            <path key={i} d={`M${C} ${C} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={s.color} stroke="#fff" strokeWidth="2.5" />
          );
        })}
      </svg>
      <div className="lv-pie-legend">
        {segments.map((s, i) => (
          <div key={i} className="lv-pie-item">
            <span className="lv-pie-swatch" style={{ background: s.color }} />
            <span className="lv-pie-value">{s.value}%</span>
            <span className="lv-pie-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bars({ series, max, unit = '$' }) {
  const height = 130;
  return (
    <div className="lv-bars">
      {series.map((s, i) => (
        <div key={i} className="lv-bar-col">
          <div className="lv-bar-track" style={{ height }}>
            <div className="lv-bar-fill" style={{
              height: `${(s.value / max) * 100}%`,
              background: s.color,
            }}>
              <span className="lv-bar-value">{unit}{s.value.toLocaleString()}</span>
            </div>
          </div>
          <span className="lv-bar-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function Stack({ layers }) {
  return (
    <div className="lv-stack">
      {layers.map((l, i) => (
        <div key={i} className="lv-stack-layer" style={{ background: l.color, width: `${l.width}%` }}>
          <span className="lv-stack-label">{l.label}</span>
        </div>
      ))}
    </div>
  );
}

function Flow({ steps }) {
  return (
    <div className="lv-flow">
      {steps.map((s, i) => (
        <div key={i} className="lv-flow-row">
          <div className="lv-flow-node" style={{ background: s.color }}>
            <Icon name={s.icon} size={22} stroke={2} />
          </div>
          <div className="lv-flow-text">
            <span className="lv-flow-title">{s.title}</span>
            {s.sub && <span className="lv-flow-sub">{s.sub}</span>}
          </div>
          {i < steps.length - 1 && <div className="lv-flow-line" aria-hidden />}
        </div>
      ))}
    </div>
  );
}

function Formula({ parts }) {
  return (
    <div className="lv-formula">
      {parts.map((p, i) => (
        <div key={i} className={`lv-formula-part ${p.op ? 'op' : ''}`}>
          {p.op ? <span className="lv-op">{p.op}</span> : (
            <>
              <span className="lv-formula-value" style={{ color: p.color }}>{p.value}</span>
              <span className="lv-formula-label">{p.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LessonVisual({ visual }) {
  if (!visual) return null;
  switch (visual.type) {
    case 'pie':     return <Pie segments={visual.segments} />;
    case 'bars':    return <Bars series={visual.series} max={visual.max} unit={visual.unit} />;
    case 'stack':   return <Stack layers={visual.layers} />;
    case 'flow':    return <Flow steps={visual.steps} />;
    case 'formula': return <Formula parts={visual.parts} />;
    default: return null;
  }
}