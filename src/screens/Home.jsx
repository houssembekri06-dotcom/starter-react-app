import { useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useProgress } from '../context/ProgressContext';
import { UNITS } from '../data/lessons';
import Pill from '../components/Pill';
import ProgressBar from '../components/ProgressBar';
import LessonChart from '../components/LessonChart';
import Icon from '../components/Icon';
import './Home.css';

function isUnitComplete(unit, completedLessonIds) {
  return unit.lessons.every((l) => completedLessonIds.includes(l.id));
}

export default function Home() {
  const { completedLessonIds, streakDays, coins, hearts, maxHearts } = useProgress();
  const navigate = useNavigate();

  const firstIncompleteUnit = useMemo(
    () => UNITS.find((u) => !isUnitComplete(u, completedLessonIds)) || UNITS[UNITS.length - 1],
    [completedLessonIds]
  );

  const [selectedUnitId, setSelectedUnitId] = useState(firstIncompleteUnit.id);
  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId) || firstIncompleteUnit;

  const unitIndex = UNITS.findIndex((u) => u.id === selectedUnit.id);
  const unitUnlocked =
    unitIndex === 0 || isUnitComplete(UNITS[unitIndex - 1], completedLessonIds);

  const completedInUnit = selectedUnit.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;

  const activeLessonId = unitUnlocked
    ? (selectedUnit.lessons.find((l) => !completedLessonIds.includes(l.id))?.id ?? null)
    : null;

  function handleNodeClick(lesson) {
    navigate(`/lesson/${lesson.id}`);
  }

  const unitProgressPct = selectedUnit.lessons.length > 0
    ? (completedInUnit / selectedUnit.lessons.length) * 100
    : 0;

  return (
    <div className="screen home-screen">
      <div className="home-dashboard-card">
        <div className="home-dashboard-left">
          <div className="home-points">
            <Icon name="coin" size={18} stroke={2} color="var(--color-coral)" />
            <span className="home-points-value">{coins}</span>
          </div>
          <span className="home-points-label">Points</span>
        </div>

        <div className="home-dashboard-center">
          <CircularProgress value={unitProgressPct} size={44} strokeWidth={5} />
          <div className="home-progress-labels">
            <span className="home-progress-title">Progression</span>
            <span className="home-progress-subtitle">{selectedUnit.title}</span>
          </div>
        </div>

        <div className="home-dashboard-right">
          <div className="home-reward-badge">
            <Icon name="building-bank" size={18} stroke={1.8} color="var(--color-indigo)" />
            <div className="home-reward-content">
              <span className="home-reward-title">Récompense</span>
              <span className="home-reward-text">80 € de bonus</span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-pills-row">
        <Pill icon="flame" iconColor="var(--color-coral)" tone="coral">{streakDays}</Pill>
        <Pill icon="heart-filled" iconColor="var(--color-rose)" tone="rose">{hearts}/{maxHearts}</Pill>
      </div>

      <div className="home-units-scroll">
        {UNITS.map((u, i) => {
          const locked = i > 0 && !isUnitComplete(UNITS[i - 1], completedLessonIds);
          const done = isUnitComplete(u, completedLessonIds);
          return (
            <button
              key={u.id}
              className={
                'unit-chip' +
                (u.id === selectedUnit.id ? ' unit-chip--active' : '') +
                (locked ? ' unit-chip--locked' : '')
              }
              disabled={locked}
              onClick={() => setSelectedUnitId(u.id)}
            >
              {locked ? <Icon name="lock" size={13} stroke={2.2} /> : done ? <Icon name="check" size={13} stroke={2.4} /> : null}
              {`Unité ${u.order}`}
            </button>
          );
        })}
      </div>

      <div className="home-unit-header">
        <div>
          <div className="home-unit-title">{selectedUnit.title}</div>
          <div className="home-unit-subtitle">{selectedUnit.subtitle}</div>
        </div>
        <span className="home-unit-count">
          {completedInUnit}/{selectedUnit.lessons.length}
        </span>
      </div>
      <ProgressBar value={completedInUnit} max={selectedUnit.lessons.length} tone="coral" />

      {!unitUnlocked ? (
        <div className="home-locked-unit">
          <Icon name="lock" size={26} stroke={1.8} color="var(--color-text-disabled)" />
          <p>Terminez l'unité précédente pour débloquer celle-ci.</p>
        </div>
      ) : (
        <LessonChart
          lessons={selectedUnit.lessons}
          completedLessonIds={completedLessonIds}
          activeLessonId={activeLessonId}
          unitUnlocked={unitUnlocked}
          onSelect={handleNodeClick}
        />
      )}
    </div>
  );
}
