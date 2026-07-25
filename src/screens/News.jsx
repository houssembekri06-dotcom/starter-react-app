import { useMemo } from 'react';
import Icon from '../components/Icon';
import newsHeroAsset from '../assets/news-hero.png.asset.json';
import './News.css';

const MOCK_NEWS = [
  {
    id: 1,
    source: 'Bloomberg Fiction',
    time: '12 min ago',
    title: 'The Fed keeps rates unchanged, markets breathe again',
    summary: 'Investors welcome the monetary stability expected for the quarter.',
    tag: 'Central banks',
    move: 0.4,
  },
  {
    id: 2,
    source: 'Reuters Simulated',
    time: '42 min ago',
    title: 'S&P 500 breaks 5,500 points in this scenario',
    summary: 'A rally in tech stocks pushes the index to a new symbolic milestone.',
    tag: 'Indices',
    move: 1.2,
  },
  {
    id: 3,
    source: 'Crypto Daily',
    time: '1 h ago',
    title: 'Bitcoin: whales accumulate ahead of the halving',
    summary: 'Large holders are increasing positions despite recent volatility.',
    tag: 'Crypto',
    move: -0.8,
  },
  {
    id: 4,
    source: 'Finance Edu',
    time: '2 h ago',
    title: 'Why inflation is slowing but not disappearing',
    summary: 'A simple breakdown of the mechanisms keeping prices elevated.',
    tag: 'Economy',
    move: 0.1,
  },
  {
    id: 5,
    source: 'MarketWatch Jr',
    time: '3 h ago',
    title: 'Tesla announces a fictional special dividend',
    summary: 'The carmaker rewards shareholders in this simulation exercise.',
    tag: 'Stocks',
    move: 2.4,
  },
  {
    id: 6,
    source: 'Finimize Learn',
    time: '5 h ago',
    title: 'ETFs: how to diversify with a single click',
    summary: 'A quick guide to understanding index funds and their fees.',
    tag: 'Education',
    move: 0.0,
  },
  {
    id: 7,
    source: 'MarketTest',
    time: '6 h ago',
    title: 'Gold climbs back above $2,100 in this scenario',
    summary: 'The yellow metal benefits from a rebound in simulated geopolitical uncertainty.',
    tag: 'Commodities',
    move: 0.6,
  },
];

function formatMove(move) {
  if (move === 0) return '0.00%';
  const sign = move > 0 ? '+' : '';
  return `${sign}${move.toFixed(2)}%`;
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
        <h1 className="news-title">News</h1>
        <span className="news-subtitle">Simulated quotes and headlines</span>
      </header>

      <section className="news-hero">
        <img
          src={newsHeroAsset.url}
          alt="Financial markets illustration"
          className="news-hero-image"
          width={1024}
          height={512}
        />
        <div className="news-hero-content">
          <span className="news-hero-tag">Top story</span>
          <h2 className="news-hero-title">
            Markets open higher in this fictional scenario
          </h2>
          <p className="news-hero-summary">
            A playful look at the mechanisms that move prices every morning.
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
