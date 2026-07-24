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
  const [blockIndex, setBlockIndex] = useState(0);

  if (!lesson) return null;
  const unit = getUnitById(lesson.unitId);
  const block = lesson.content[blockIndex];
  const isLastBlock = blockIndex === lesson.content.length - 1;

  function handleContinue() {
    if (isLastBlock) navigate(`/lesson/${lesson.id}/quiz`);
    else setBlockIndex((i) => i + 1);
  }

  return (
    <div className="screen lesson-screen">
      <div className="lesson-top-row">
        <button className="icon-btn" onClick={() => navigate('/home')} aria-label="Quitter">
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
        {isLastBlock ? 'Passer au quiz' : 'Continuer'}
      </button>
    </div>
  );
}
