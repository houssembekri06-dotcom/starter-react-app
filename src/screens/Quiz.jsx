import { useState } from 'react';
import { useNavigate, useParams } from '@/lib/router-compat';
import { getLessonById } from '../data/lessons';
import { useProgress } from '../context/ProgressContext';
import Pill from '../components/Pill';
import Icon from '../components/Icon';
import './Quiz.css';
import './Quiz.css';

export default function Quiz() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId);
  const { hearts, maxHearts, loseHeart, completeLesson } = useProgress();

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!lesson) return null;
  const { quiz } = lesson;
  const isCorrect = submitted && selected === quiz.correctIndex;
  const isWrong = submitted && selected !== quiz.correctIndex;

  function handleValidate() {
    if (selected === null) return;
    if (selected !== quiz.correctIndex) loseHeart();
    setSubmitted(true);
  }

  function handleRetry() {
    setSelected(null);
    setSubmitted(false);
  }

  function handleContinue() {
    completeLesson(lesson.id);
    navigate('/home');
  }

  return (
    <div className="screen quiz-screen">
      <div className="lesson-top-row">
        <button className="icon-btn" onClick={() => navigate('/home')} aria-label="Quitter">
          <Icon name="close" size={16} stroke={2.2} />
        </button>
        <Pill icon="heart-filled" iconColor="var(--color-rose)" tone="rose">{hearts}/{maxHearts}</Pill>
      </div>

      <div className="quiz-body">
        <span className="lesson-eyebrow">Quiz</span>
        <h1 className="quiz-question">{quiz.question}</h1>

        <div className="quiz-options">
          {quiz.options.map((opt, i) => {
            let tone = '';
            if (submitted && i === quiz.correctIndex) tone = 'quiz-option--correct';
            else if (submitted && i === selected) tone = 'quiz-option--wrong';
            else if (!submitted && i === selected) tone = 'quiz-option--selected';
            return (
              <button
                key={i}
                className={`quiz-option ${tone}`}
                disabled={submitted}
                onClick={() => setSelected(i)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {submitted && (
        <div className={`quiz-feedback ${isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}>
          <div className="quiz-feedback-title">
            <Icon name={isCorrect ? 'circle-check' : 'close'} size={18} stroke={2.2} />
            {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait'}
          </div>
          <p>{quiz.explanation}</p>
        </div>
      )}

      {!submitted ? (
        <button className="btn btn-primary" disabled={selected === null} onClick={handleValidate}>
          Valider
        </button>
      ) : isCorrect ? (
        <button className="btn btn-primary" onClick={handleContinue}>
          Continuer (+{lesson.xp} XP)
        </button>
      ) : (
        <button className="btn btn-coral" onClick={handleRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}
