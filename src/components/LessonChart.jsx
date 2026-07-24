import { useMemo } from 'react';
import Icon from './Icon';
import './LessonChart.css';

const NODE = 56;
const ROW_H = 130;
const PAD_TOP = 60;
const PAD_BOTTOM = 60;
const ROAD_W = 34; // road width as % of chart

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

// Generate a block of buildings on one side for a given vertical segment.
function sideBlocks(rand, count, side, segmentY, segmentH) {
  const blocks = [];
  for (let i = 0; i < count; i++) {
    const y = segmentY + rand() * segmentH;
    const h = 18 + rand() * 34;
    const w = 10 + rand() * 16;
    // side: -1 left, 1 right
    const x = side === -1
      ? -w - rand() * 18
      : 100 + rand() * 18;
    const roofType = Math.floor(rand() * 4);
    blocks.push({ x, y, w, h, roofType });
  }
  return blocks;
}

function blockPath(b) {
  const floorY = b.y + b.h;
  const roofY = b.y;
  let d = `M ${b.x} ${floorY} V ${roofY}`;
  if (b.roofType === 1) {
    d += ` L ${b.x + b.w / 2} ${roofY - 5} L ${b.x + b.w} ${roofY}`;
  } else if (b.roofType === 2) {
    d += ` L ${b.x + 3} ${roofY - 4} L ${b.x + 3} ${roofY - 8} L ${b.x + b.w - 3} ${roofY - 8} L ${b.x + b.w - 3} ${roofY - 4} L ${b.x + b.w} ${roofY}`;
  } else if (b.roofType === 3) {
    d += ` L ${b.x + b.w / 2} ${roofY - 6} L ${b.x + b.w} ${roofY}`;
  } else {
    d += ` L ${b.x + b.w} ${roofY}`;
  }
  d += ` V ${floorY} Z`;
  return d;
}

export default function LessonChart({ lessons, completedLessonIds, activeLessonId, unitUnlocked, onSelect }) {
  const n = lessons.length;
  const height = PAD_TOP + (n - 1) * ROW_H + PAD_BOTTOM + NODE;

  const { xPositions, blocks } = useMemo(() => {
    const seed = hashString(lessons[0]?.unitId || lessons[0]?.id || 'seed');
    const rand = mulberry32(seed);
    const xs = [];
    let prev = 50;
    for (let i = 0; i < n; i++) {
      let next;
      let tries = 0;
      do {
        next = 35 + rand() * 30; // keep nodes in the road corridor
        tries++;
      } while (Math.abs(next - prev) < 10 && tries < 8);
      xs.push(next);
      prev = next;
    }

    const allBlocks = [];
    const segments = Math.max(1, Math.floor(height / 120));
    for (let s = 0; s < segments; s++) {
      const segY = s * 120;
      const segH = 120;
      allBlocks.push(...sideBlocks(rand, 2 + Math.floor(rand() * 2), -1, segY, segH));
      allBlocks.push(...sideBlocks(rand, 2 + Math.floor(rand() * 2), 1, segY, segH));
    }

    return { xPositions: xs, blocks: allBlocks };
  }, [lessons, n, height]);

  const points = lessons.map((_, i) => ({
    x: xPositions[i],
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
        {/* Buildings on both sides of the road */}
        <g className="lesson-chart-buildings">
          {blocks.map((b, i) => (
            <path key={`b-${i}`} d={blockPath(b)} />
          ))}
        </g>

        {/* Road surface */}
        <rect
          x={(100 - ROAD_W) / 2}
          y="0"
          width={ROAD_W}
          height={height}
          className="lesson-chart-road"
        />

        {/* Road center dashed line */}
        <line
          x1="50"
          x2="50"
          y1="0"
          y2={height}
          className="lesson-chart-road-line"
          vectorEffect="non-scaling-stroke"
        />

        {/* Lesson path */}
        {n > 1 && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-indigo)"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 5 }}
          />
        )}
      </svg>

      {lessons.map((lesson, i) => {
        const completed = completedLessonIds.includes(lesson.id);
        const active = unitUnlocked && lesson.id === activeLessonId;
        const state = completed ? 'completed' : active ? 'active' : 'locked';
        const iconName = completed ? 'check' : active ? 'chart-line' : 'lock';
        const xPct = xPositions[i];
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
