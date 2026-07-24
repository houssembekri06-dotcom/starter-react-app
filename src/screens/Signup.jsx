import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';
import Icon from '../components/Icon';
import './Signup.css';

const GOALS = [
  { key: 'apprendre', icon: 'piggy-bank', title: 'Apprendre les bases', body: "Je veux d'abord comprendre comment fonctionne la finance." },
  { key: 'epargner', icon: 'target', title: 'Épargner régulièrement', body: 'Je veux prendre de bonnes habitudes pour mettre de côté chaque mois.' },
  { key: 'investir', icon: 'rocket', title: "Investir pour l'avenir", body: 'Je veux apprendre à faire fructifier mon argent sur le long terme.' },
];

const LEVELS = [
  { key: 'debutant', title: 'Débutant', body: "Je découvre tout juste ces sujets." },
  { key: 'intermediaire', title: 'Intermédiaire', body: "J'ai déjà quelques notions de base." },
  { key: 'avance', title: 'Avancé', body: "Je connais déjà bien la finance et l'investissement." },
];

const TOTAL_STEPS = 3;

export default function Signup() {
  const navigate = useNavigate();
  const { completeSignup } = useProgress();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(null);

  const step1Valid = name.trim().length > 0 && email.trim().length > 3 && password.length >= 4;

  function handleBack() {
    if (step === 1) navigate('/onboarding');
    else setStep((s) => s - 1);
  }

  function handleContinue() {
    if (step === 1 && !step1Valid) return;
    if (step === 2 && !goal) return;
    if (step === 3) {
      if (!level) return;
      completeSignup({ name: name.trim(), goal, level });
      navigate('/home', { replace: true });
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="screen signup-screen">
      <div className="lesson-top-row">
        <button className="icon-btn" onClick={handleBack} aria-label="Retour">
          <Icon name="back" size={17} stroke={2.2} />
        </button>
        <ProgressBar value={step} max={TOTAL_STEPS} tone="indigo" />
      </div>

      {step === 1 && (
        <div className="signup-body">
          <h1 className="signup-title">Créez votre compte</h1>
          <p className="signup-subtitle">Vos informations restent sur cet appareil, aucune donnée réelle n'est envoyée.</p>

          <div className="signup-field">
            <label className="invest-label">Prénom</label>
            <input className="invest-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Camille" />
          </div>
          <div className="signup-field">
            <label className="invest-label">Email</label>
            <input className="invest-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="camille@exemple.fr" />
          </div>
          <div className="signup-field">
            <label className="invest-label">Mot de passe</label>
            <input className="invest-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="signup-body">
          <h1 className="signup-title">Quel est votre objectif principal ?</h1>
          <p className="signup-subtitle">On personnalise votre parcours en fonction de votre réponse.</p>
          <div className="choice-list">
            {GOALS.map((g) => (
              <button
                key={g.key}
                className={`choice-card${goal === g.key ? ' choice-card--selected' : ''}`}
                onClick={() => setGoal(g.key)}
              >
                <span className="choice-card-icon">
                  <Icon name={g.icon} size={20} stroke={1.9} color={goal === g.key ? 'var(--color-indigo)' : 'var(--color-text-secondary)'} />
                </span>
                <span className="choice-card-text">
                  <span className="choice-card-title">{g.title}</span>
                  <span className="choice-card-body">{g.body}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="signup-body">
          <h1 className="signup-title">Quel est votre niveau en finance ?</h1>
          <p className="signup-subtitle">Cela nous aide à calibrer le rythme de vos premières leçons.</p>
          <div className="choice-list">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                className={`choice-card${level === l.key ? ' choice-card--selected' : ''}`}
                onClick={() => setLevel(l.key)}
              >
                <span className="choice-card-text">
                  <span className="choice-card-title">{l.title}</span>
                  <span className="choice-card-body">{l.body}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className="btn btn-primary"
        disabled={(step === 1 && !step1Valid) || (step === 2 && !goal) || (step === 3 && !level)}
        onClick={handleContinue}
      >
        {step === 3 ? "Terminer l'inscription" : 'Continuer'}
      </button>
    </div>
  );
}
