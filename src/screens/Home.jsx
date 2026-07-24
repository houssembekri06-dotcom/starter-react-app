import { useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useProgress } from '../context/ProgressContext';
import { UNITS } from '../data/lessons';
import Pill from '../components/Pill';
import ProgressBar from '../components/ProgressBar';
import LessonChart from '../components/LessonChart';
import MarketTicker from '../components/MarketTicker';
import Icon from '../components/Icon';
import './Home.css';

function isUnitComplete(unit, completedLessonIds) {
  return unit.lessons.every((l) => completedLessonIds.includes(l.id));
}

export default function Home() {
  const { completedLessonIds, streakDays, hearts, maxHearts } = useProgress();
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

  return (
    <div className="screen home-screen">
      <MarketTicker />

      <div className="home-units-scroll">
        {UNITS.map((u, i) => {
          const locked = i > 0 && !isUnitComplete(UNITS[i - 1], completedLessonIds);
          const active = u.id === selectedUnit.id;
          return (
            <button
              key={u.id}
              className={
                'unit-chip' +
                (active ? ' unit-chip--active' : '') +
                (locked ? ' unit-chip--locked' : '')
              }
              disabled={locked}
              onClick={() => setSelectedUnitId(u.id)}
            >
              {locked && <Icon name="lock" size={15} stroke={2.4} />}
              <span>{`Unité ${u.order}`}</span>
            </button>
          );
        })}
      </div>

      <div className="unit-info-card">
        <div className="unit-info-head">
          <h2 className="unit-info-title">{selectedUnit.title}</h2>
          <span className="unit-info-status">
            {unitUnlocked ? 'En cours' : 'Verrouillée'}
          </span>
        </div>
        <p className="unit-info-subtitle">{selectedUnit.subtitle}</p>
        <div className="unit-info-progress">
          <div className="unit-info-progress-row">
            <span className="unit-info-progress-label">Progression</span>
            <span className="unit-info-progress-count">
              {completedInUnit} / {selectedUnit.lessons.length} leçons
            </span>
          </div>
          <ProgressBar value={completedInUnit} max={selectedUnit.lessons.length} tone="indigo" />
        </div>
      </div>

      <div className="home-pills-row">
        <Pill icon="flame" iconColor="var(--color-coral)" tone="coral">{streakDays}</Pill>
        <Pill icon="heart-filled" iconColor="var(--color-rose)" tone="rose">{hearts}/{maxHearts}</Pill>
      </div>

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
