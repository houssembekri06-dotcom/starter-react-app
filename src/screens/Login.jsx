import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
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
        <button className="icon-btn" onClick={() => navigate('/onboarding')} aria-label="Back">
          <Icon name="back" size={17} stroke={2.2} />
        </button>
      </div>

      <div className="signup-body">
        <h1 className="signup-title">Welcome back</h1>
        <p className="signup-subtitle">Sign in to pick up where you left off.</p>

        <div className="signup-field">
          <label className="invest-label">Email</label>
          <input className="invest-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" />
        </div>
        <div className="signup-field">
          <label className="invest-label">Password</label>
          <input className="invest-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 characters minimum" />
        </div>
      </div>

      <button className="btn btn-primary" disabled={!valid} onClick={handleSubmit}>
        Sign in
      </button>
      <button className="text-link" onClick={() => navigate('/signup')}>
        Create account
      </button>
    </div>
  );
}
