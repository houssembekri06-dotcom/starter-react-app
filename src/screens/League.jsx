import { useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { Card } from '../components/Card';
import Icon from '../components/Icon';
import './League.css';

const BOTS = [
  { name: 'Camille', xp: 340 },
  { name: 'Yanis', xp: 285 },
  { name: 'Léa', xp: 210 },
  { name: 'Mehdi', xp: 165 },
  { name: 'Sofia', xp: 95 },
  { name: 'Tom', xp: 40 },
];

export default function League() {
  const { xpTotal, league } = useProgress();

  const ranking = useMemo(() => {
    const players = [...BOTS, { name: 'Vous', xp: xpTotal, isUser: true }];
    return players.sort((a, b) => b.xp - a.xp);
  }, [xpTotal]);

  return (
    <div className="screen league-screen">
      <div className="league-header">
        <div className="league-badge">
          <Icon name="trophy" size={30} stroke={1.6} color="var(--color-coral)" />
        </div>
        <div className="league-title">{league}</div>
        <p className="league-subtitle">Gagnez de l'XP en terminant des leçons pour grimper au classement.</p>
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
