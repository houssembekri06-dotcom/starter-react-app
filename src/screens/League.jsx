import { useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { Card } from '../components/Card';
import Icon from '../components/Icon';
import './League.css';

const BOTS = [
  { name: 'Camille', base: 60 },
  { name: 'Yanis', base: 48 },
  { name: 'Léa', base: 38 },
  { name: 'Mehdi', base: 28 },
  { name: 'Sofia', base: 18 },
  { name: 'Tom', base: 9 },
];

// Deterministic per-week jitter so the leaderboard looks different each week
// (a "living" league) without any backend. Same week → same numbers.
function weeklyBotXp(bot, weekId, daysElapsed) {
  const seed = (weekId * 2654435761 + bot.name.length * 40503) >>> 0;
  const wobble = 0.6 + ((seed % 100) / 100) * 0.9; // 0.6–1.5×
  const perDay = bot.base * wobble;
  return Math.round(perDay * Math.min(7, daysElapsed + 1));
}

export default function League() {
  const { weeklyXp = 0, league, weeklyResetInDays = 7 } = useProgress();
  const daysElapsed = 7 - weeklyResetInDays;
  const weekId = Math.floor((Date.now?.() ?? 0) / (7 * 86400000));

  const ranking = useMemo(() => {
    const bots = BOTS.map((b) => ({ name: b.name, xp: weeklyBotXp(b, weekId, daysElapsed) }));
    const players = [...bots, { name: 'You', xp: weeklyXp, isUser: true }];
    return players.sort((a, b) => b.xp - a.xp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyXp, weekId, daysElapsed]);

  const myRank = ranking.findIndex((p) => p.isUser) + 1;

  return (
    <div className="screen league-screen">
      <div className="league-header">
        <div className="league-badge">
          <Icon name="trophy" size={30} stroke={1.6} color="var(--color-coral)" />
        </div>
        <div className="league-title">{league}</div>
        <p className="league-subtitle">Earn XP this week to climb the leaderboard.</p>
        <div className="league-meta">
          <span className="league-meta-chip">
            <Icon name="sparkles" size={13} stroke={2.2} color="var(--color-indigo)" />
            You're #{myRank}
          </span>
          <span className="league-meta-chip">
            <Icon name="flame" size={13} stroke={2.2} color="var(--color-coral)" />
            Resets in {weeklyResetInDays}d
          </span>
        </div>
      </div>

      <Card>
        {ranking.map((p, i) => (
          <div key={p.name} className={`league-row${p.isUser ? ' league-row--user' : ''}`}>
            <span className="league-rank">{i + 1}</span>
            <span className="league-name">{p.name}</span>
            <span className="league-xp">{p.xp} XP</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
