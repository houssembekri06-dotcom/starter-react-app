import { useMemo } from 'react';
import Icon from '../components/Icon';
import newsHeroAsset from '../assets/news-hero.png.asset.json';
import './News.css';

const MOCK_NEWS = [
  {
    id: 1,
    source: 'Bloomberg Fictif',
    time: 'Il y a 12 min',
    title: 'La BCE laisse ses taux inchangés, les marchés respirent',
    summary: 'Les investisseurs saluent la stabilité monétaire attendue pour le trimestre.',
    tag: 'Banques centrales',
    move: 0.4,
  },
  {
    id: 2,
    source: 'Reuters Simulé',
    time: 'Il y a 42 min',
    title: 'Le CAC 40 franchit les 8 000 points dans ce scénario',
    summary: 'Une hausse des valeurs technologiques tire l’indice vers un nouveau seuil symbolique.',
    tag: 'Indices',
    move: 1.2,
  },
  {
    id: 3,
    source: 'Crypto Daily',
    time: 'Il y a 1 h',
    title: 'Bitcoin : les whales accumulent avant le halving',
    summary: 'Les grosses adresses augmentent leurs positions malgré la volatilité récente.',
    tag: 'Crypto',
    move: -0.8,
  },
  {
    id: 4,
    source: 'Les Échos Édu',
    time: 'Il y a 2 h',
    title: 'Pourquoi l’inflation ralentit mais ne disparaît pas',
    summary: 'Un décryptage simple des mécanismes qui maintiennent les prix élevés.',
    tag: 'Économie',
    move: 0.1,
  },
  {
    id: 5,
    source: 'MarketWatch Jr',
    time: 'Il y a 3 h',
    title: 'Tesla annonce un dividende exceptionnel fictif',
    summary: 'Le constructeur récompense ses actionnaires dans cet exercice de simulation.',
    tag: 'Actions',
    move: 2.4,
  },
  {
    id: 6,
    source: 'Finimize Learn',
    time: 'Il y a 5 h',
    title: 'ETF : comment diversifier avec un seul clic',
    summary: 'Le guide rapide pour comprendre les fonds indiciels et leurs frais.',
    tag: 'Éducation',
    move: 0.0,
  },
  {
    id: 7,
    source: 'Boursorama Test',
    time: 'Il y a 6 h',
    title: 'L’or repasse au-dessus de 2 100 $ dans ce scénario',
    summary: 'Le métal jaune profite d’un rebond de l’incertitude géopolitique simulée.',
    tag: 'Matières premières',
    move: 0.6,
  },
];

function formatMove(move) {
  if (move === 0) return '0,00 %';
  const sign = move > 0 ? '+' : '';
  return `${sign}${move.toFixed(2).replace('.', ',')} %`;
}

function NewsCard({ item }) {
  const isUp = item.move > 0;
  const isDown = item.move < 0;

  return (
    <article className="news-card">
      <div className="news-card-meta">
        <span className="news-card-source">{item.source}</span>
        <span className="news-card-dot" aria-hidden="true" />
        <span className="news-card-time">{item.time}</span>
      </div>
      <h3 className="news-card-title">{item.title}</h3>
      <p className="news-card-summary">{item.summary}</p>
      <div className="news-card-footer">
        <span className="news-card-tag">{item.tag}</span>
        <span
          className={
            'news-card-move' +
            (isUp ? ' news-card-move--up' : '') +
            (isDown ? ' news-card-move--down' : '')
          }
        >
          {isUp && <Icon name="arrow-up-right" size={14} stroke={2.2} />}
          {isDown && <Icon name="arrow-down-right" size={14} stroke={2.2} />}
          {formatMove(item.move)}
        </span>
      </div>
    </article>
  );
}

export default function News() {
  const sortedNews = useMemo(
    () => [...MOCK_NEWS].sort((a, b) => a.id - b.id),
    []
  );

  return (
    <div className="screen news-screen">
      <header className="news-header">
        <h1 className="news-title">Actualités</h1>
        <span className="news-subtitle">Cours et titres simulés</span>
      </header>

      <section className="news-hero">
        <img
          src={newsHeroAsset.url}
          alt="Illustration des marchés financiers"
          className="news-hero-image"
          width={1024}
          height={512}
        />
        <div className="news-hero-content">
          <span className="news-hero-tag">À la une</span>
          <h2 className="news-hero-title">
            Les marchés ouvrent en hausse dans ce scénario fictif
          </h2>
          <p className="news-hero-summary">
            Un regard ludique sur les mécanismes qui font bouger les cours chaque matin.
          </p>
        </div>
      </section>

      <div className="news-list">
        {sortedNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
