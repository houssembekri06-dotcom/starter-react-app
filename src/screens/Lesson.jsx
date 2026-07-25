import { useState } from 'react';
import { useNavigate, useParams } from '@/lib/router-compat';
import { getLessonById, getUnitById } from '../data/lessons';
import ProgressBar from '../components/ProgressBar';
import Icon from '../components/Icon';
import './Lesson.css';

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);
  const [started, setStarted] = useState(false);
  const [blockIndex, setBlockIndex] = useState(0);

  if (!lesson) return null;
  const unit = getUnitById(lesson.unitId);
  const block = lesson.content[blockIndex];
  const isLastBlock = blockIndex === lesson.content.length - 1;

  function handleContinue() {
    if (isLastBlock) navigate(`/lesson/${lesson.id}/quiz`);
    else setBlockIndex((i) => i + 1);
  }

  if (!started) {
    const minutes = Math.max(1, Math.round(lesson.content.length * 1.2));
    return (
      <div className="screen lesson-screen">
        <div className="lesson-top-row">
          <button className="icon-btn" onClick={() => navigate('/home')} aria-label="Close">
            <Icon name="close" size={16} stroke={2.2} />
          </button>
          <span className="lesson-eyebrow">{unit?.title}</span>
        </div>

        <div className="lesson-body">
          <div className="lesson-summary-card">
            <div className="lesson-summary-icon">
              <Icon name={unit?.icon || 'book'} size={28} stroke={2} />
            </div>
            <span className="lesson-summary-eyebrow">Lesson preview</span>
            <h1 className="lesson-summary-title">{lesson.title}</h1>

            <div className="lesson-summary-stats">
              <div className="lesson-summary-stat">
                <span className="lesson-summary-stat-value">{lesson.content.length}</span>
                <span className="lesson-summary-stat-label">parts</span>
              </div>
              <div className="lesson-summary-stat">
                <span className="lesson-summary-stat-value">~{minutes}</span>
                <span className="lesson-summary-stat-label">min</span>
              </div>
              <div className="lesson-summary-stat">
                <span className="lesson-summary-stat-value">+{lesson.xp}</span>
                <span className="lesson-summary-stat-label">XP</span>
              </div>
            </div>

            <div className="lesson-summary-outline">
              <span className="lesson-summary-outline-title">What you'll learn</span>
              <ul>
                {lesson.content.map((b, i) => (
                  <li key={i}>
                    <Icon name="circle-check" size={14} stroke={2.2} />
                    <span>{b.heading || b.body.split('.')[0]}</span>
                  </li>
                ))}
                <li>
                  <Icon name="target" size={14} stroke={2.2} />
                  <span>Quick quiz to lock it in</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setStarted(true)}>
          Start lesson
        </button>
      </div>
    );
  }

  return (
    <div className="screen lesson-screen">
      <div className="lesson-top-row">
        <button className="icon-btn" onClick={() => navigate('/home')} aria-label="Close">
          <Icon name="close" size={16} stroke={2.2} />
        </button>
        <ProgressBar value={blockIndex + 1} max={lesson.content.length} tone="indigo" />
      </div>

      <div className="lesson-body">
        <span className="lesson-eyebrow">{unit?.title}</span>
        <h1 className="lesson-title">{lesson.title}</h1>
        {block.heading && <h2 className="lesson-block-heading">{block.heading}</h2>}
        <p className="lesson-block-body">{block.body}</p>
      </div>

      <button className="btn btn-primary" onClick={handleContinue}>
        {isLastBlock ? 'Take the quiz' : 'Continue'}
      </button>
    </div>
  );
}
