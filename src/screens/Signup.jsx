import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';
import Icon from '../components/Icon';
import './Signup.css';

const GOALS = [
  { key: 'learn', icon: 'piggy-bank', title: 'Learn the basics', body: "I want to first understand how finance works." },
  { key: 'save', icon: 'target', title: 'Save regularly', body: 'I want to build good habits and set money aside each month.' },
  { key: 'invest', icon: 'rocket', title: "Invest for the future", body: 'I want to learn how to grow my money for the long term.' },
];

const LEVELS = [
  { key: 'beginner', title: 'Beginner', body: "I'm just discovering these topics." },
  { key: 'intermediate', title: 'Intermediate', body: "I already know some basics." },
  { key: 'advanced', title: 'Advanced', body: "I'm already comfortable with finance and investing." },
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
        <button className="icon-btn" onClick={handleBack} aria-label="Back">
          <Icon name="back" size={17} stroke={2.2} />
        </button>
        <ProgressBar value={step} max={TOTAL_STEPS} tone="indigo" />
      </div>

      {step === 1 && (
        <div className="signup-body">
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">Your info stays on this device — no real data is sent.</p>

          <div className="signup-field">
            <label className="invest-label">First name</label>
            <input className="invest-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" />
          </div>
          <div className="signup-field">
            <label className="invest-label">Email</label>
            <input className="invest-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" />
          </div>
          <div className="signup-field">
            <label className="invest-label">Password</label>
            <input className="invest-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 characters minimum" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="signup-body">
          <h1 className="signup-title">What is your main goal?</h1>
          <p className="signup-subtitle">We'll tailor your journey based on your answer.</p>
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
          <h1 className="signup-title">What is your finance level?</h1>
          <p className="signup-subtitle">This helps us pace your first lessons.</p>
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
        {step === 3 ? 'Finish sign up' : 'Continue'}
      </button>
    </div>
  );
}
