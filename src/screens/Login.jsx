import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import Icon from '../components/Icon';
import './Signup.css';

export default function Login() {
  const navigate = useNavigate();
  const { completeOnboarding } = useProgress();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const valid = email.trim().length > 3 && password.length >= 4;

  function handleSubmit() {
    if (!valid) return;
    completeOnboarding();
    navigate('/home', { replace: true });
  }

  return (
    <div className="screen signup-screen">
      <div className="lesson-top-row">
        <button className="icon-btn" onClick={() => navigate('/onboarding')} aria-label="Retour">
          <Icon name="back" size={17} stroke={2.2} />
        </button>
      </div>

      <div className="signup-body">
        <h1 className="signup-title">Content de vous revoir</h1>
        <p className="signup-subtitle">Connectez-vous pour retrouver votre progression.</p>

        <div className="signup-field">
          <label className="invest-label">Email</label>
          <input className="invest-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="camille@exemple.fr" />
        </div>
        <div className="signup-field">
          <label className="invest-label">Mot de passe</label>
          <input className="invest-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" />
        </div>
      </div>

      <button className="btn btn-primary" disabled={!valid} onClick={handleSubmit}>
        Se connecter
      </button>
      <button className="text-link" onClick={() => navigate('/signup')}>
        Créer un compte
      </button>
    </div>
  );
}
