import { useMemo } from 'react';
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

  const selectedUnit = useMemo(
    () => UNITS.find((u) => !isUnitComplete(u, completedLessonIds)) || UNITS[UNITS.length - 1],
    [completedLessonIds]
  );

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
    <>
      <MarketTicker />
      <div className="screen home-screen">
        <div className="unit-info-card">
          <div className="unit-info-head">
            <div className="unit-info-title-wrap">
              <span className="unit-info-order">Unit {selectedUnit.order}</span>
              <h2 className="unit-info-title">{selectedUnit.title}</h2>
            </div>
            <span className="unit-info-status">
              {unitUnlocked ? 'In progress' : 'Locked'}
            </span>
          </div>
          <p className="unit-info-subtitle">{selectedUnit.subtitle}</p>
          <div className="unit-info-progress">
            <div className="unit-info-progress-row">
              <span className="unit-info-progress-label">Progress</span>
              <span className="unit-info-progress-count">
                {completedInUnit} / {selectedUnit.lessons.length} lessons
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
            <p>Complete the previous unit to unlock this one.</p>
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
    </>
  );
}
