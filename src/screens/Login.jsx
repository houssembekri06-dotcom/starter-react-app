import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useProgress } from '../context/ProgressContext';
import Icon from '../components/Icon';
import './Signup.css';
import './Login.css';

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

  function handleSocial() {
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
        <div className="login-brand">
          <div className="login-brand-mark">
            <svg viewBox="0 0 48 48" width="44" height="44">
              <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#5B4FE8" />
                  <stop offset="1" stopColor="#3E33B8" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#loginGrad)" />
              <polyline points="10,34 20,26 27,30 36,18" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="36" cy="18" r="2.6" fill="#FF7A3D" />
            </svg>
          </div>
          <h1 className="signup-title">Welcome back</h1>
          <p className="signup-subtitle">Sign in to pick up where you left off.</p>
        </div>

        <div className="social-buttons">
          <button className="social-btn social-btn--apple" onClick={handleSocial}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M16.365 1.43c0 1.14-.46 2.24-1.2 3.06-.79.87-2.09 1.55-3.16 1.47-.14-1.11.42-2.28 1.14-3.05.82-.88 2.22-1.53 3.22-1.48zM20.5 17.4c-.55 1.28-.82 1.86-1.53 2.99-1 1.58-2.4 3.54-4.14 3.56-1.55.01-1.94-1.01-4.04-1-2.1.01-2.53 1.02-4.08 1.01-1.74-.02-3.07-1.79-4.06-3.37-2.79-4.42-3.09-9.61-1.36-12.37 1.22-1.94 3.14-3.07 4.94-3.07 1.84 0 2.99 1.01 4.51 1.01 1.48 0 2.38-1.01 4.51-1.01 1.61 0 3.31.88 4.53 2.39-3.98 2.18-3.33 7.87 1.72 9.86z"/>
            </svg>
            <span>Continue with Apple</span>
          </button>
          <button className="social-btn social-btn--google" onClick={handleSocial}>
            <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="social-divider"><span>or sign in with email</span></div>

        <div className="signup-field">
          <label className="invest-label">Email</label>
          <input className="invest-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" />
        </div>
        <div className="signup-field">
          <label className="invest-label">Password</label>
          <input className="invest-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 characters minimum" />
        </div>
        <button className="forgot-link" onClick={() => {}}>Forgot password?</button>
      </div>

      <button className="btn btn-primary" disabled={!valid} onClick={handleSubmit}>
        Sign in
      </button>
      <p className="login-footer">
        New here?{' '}
        <button className="text-link text-link--inline" onClick={() => navigate('/signup')}>
          Create account
        </button>
      </p>
    </div>
  );
}
