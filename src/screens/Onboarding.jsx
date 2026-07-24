import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import './Onboarding.css';

const SLIDES = [
  {
    title: 'La finance, expliquée simplement',
    body: "Apprenez les bases de l'épargne et de l'investissement en quelques minutes par jour, avec des leçons courtes et interactives.",
    illustration: <IllustrationGrowth />,
  },
  {
    title: 'Entraînez-vous sans risque',
    body: "Un portefeuille 100 % fictif vous permet d'acheter et de suivre de vrais types d'actifs, sans jamais utiliser de véritable argent.",
    illustration: <IllustrationWallet />,
  },
  {
    title: 'Progressez à votre rythme',
    body: 'Chaque leçon débloque un peu plus les outils d\'une vraie plateforme d\'investissement. Zéro pression, juste de la pratique.',
    illustration: <IllustrationPath />,
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  function next() {
    if (isLast) navigate('/signup');
    else setIndex((i) => i + 1);
  }

  return (
    <div className="onboarding">
      <div className="onboarding-illustration">{slide.illustration}</div>

      <div className="onboarding-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={'onboarding-dot' + (i === index ? ' onboarding-dot--active' : '')}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <h1 className="onboarding-title">{slide.title}</h1>
      <p className="onboarding-body">{slide.body}</p>

      <div className="onboarding-actions">
        <button className="btn btn-primary" onClick={next}>
          {isLast ? 'Créer un compte' : 'Suivant'}
        </button>
        <button className="text-link" onClick={() => navigate('/login')}>
          J'ai déjà un compte
        </button>
      </div>
    </div>
  );
}

function IllustrationGrowth() {
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B4FE8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#5B4FE8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="200" rx="28" fill="url(#g1)" />
      <polyline points="24,150 70,120 100,140 140,90 170,100 216,50" fill="none" stroke="#5B4FE8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="216" cy="50" r="9" fill="#FF7A3D" />
      <circle cx="60" cy="60" r="16" fill="#FFE4D2" />
      <text x="60" y="66" fontSize="16" textAnchor="middle" fill="#993C1D" fontWeight="700">€</text>
      <circle cx="190" cy="140" r="13" fill="#D7F5F0" />
      <text x="190" y="145" fontSize="13" textAnchor="middle" fill="#0F6E56" fontWeight="700">€</text>
    </svg>
  );
}

function IllustrationWallet() {
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%">
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF7A3D" stopOpacity="0.14" />
          <stop offset="1" stopColor="#FF7A3D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="200" rx="28" fill="url(#g2)" />
      <rect x="45" y="70" width="150" height="95" rx="18" fill="#FFFFFF" stroke="#E4E1F5" strokeWidth="2" />
      <rect x="45" y="70" width="150" height="34" rx="18" fill="#5B4FE8" />
      <circle cx="165" cy="87" r="10" fill="#FFE4D2" />
      <rect x="63" y="118" width="70" height="10" rx="5" fill="#EEEDFE" />
      <rect x="63" y="136" width="100" height="10" rx="5" fill="#F4F4F8" />
      <rect x="145" y="45" width="46" height="30" rx="8" fill="#0F6E56" opacity="0.85" />
      <text x="168" y="65" fontSize="14" textAnchor="middle" fill="white" fontWeight="700">+4%</text>
    </svg>
  );
}

function IllustrationPath() {
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%">
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F6E56" stopOpacity="0.12" />
          <stop offset="1" stopColor="#0F6E56" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="200" rx="28" fill="url(#g3)" />
      <path d="M40,160 C70,160 70,120 100,120 C130,120 130,80 160,80 C180,80 180,60 200,45" fill="none" stroke="#E4E1F5" strokeWidth="10" strokeLinecap="round" />
      <circle cx="40" cy="160" r="14" fill="#0F6E56" />
      <circle cx="100" cy="120" r="14" fill="#5B4FE8" />
      <circle cx="160" cy="80" r="14" fill="#FF7A3D" />
      <circle cx="200" cy="45" r="16" fill="#FFFFFF" stroke="#FF7A3D" strokeWidth="3" />
      <text x="200" y="50" fontSize="14" textAnchor="middle" fill="#FF7A3D" fontWeight="700">★</text>
    </svg>
  );
}
