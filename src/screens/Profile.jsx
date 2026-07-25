import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { Card } from '../components/Card';
import Icon from '../components/Icon';
import './Profile.css';


export default function Profile() {
  const { userName, streakDays, xpTotal, league, coins, completedLessonsCount, totalLessons, resetProgress } = useProgress();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="screen profile-screen">
      <div className="profile-header">
        <div className="profile-avatar">
          <Icon name="user" size={38} stroke={1.5} color="var(--color-indigo)" />
        </div>
        <div>
          <div className="profile-name">{userName || 'You'}</div>
          <div className="profile-league">{league}</div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <Card className="profile-stat">
          <Icon name="flame" size={20} stroke={2} color="var(--color-coral)" />
          <div className="profile-stat-value">{streakDays}</div>
          <div className="profile-stat-label">Day streak</div>
        </Card>
        <Card className="profile-stat">
          <Icon name="sparkles" size={20} stroke={2} color="var(--color-indigo)" />
          <div className="profile-stat-value">{xpTotal}</div>
          <div className="profile-stat-label">Total XP</div>
        </Card>
        <Card className="profile-stat">
          <Icon name="coins" size={20} stroke={2} color="var(--color-coral)" />
          <div className="profile-stat-value">{coins}</div>
          <div className="profile-stat-label">Coins</div>
        </Card>
        <Card className="profile-stat">
          <Icon name="trophy" size={20} stroke={2} color="var(--color-teal)" />
          <div className="profile-stat-value">{completedLessonsCount}/{totalLessons}</div>
          <div className="profile-stat-label">Lessons</div>
        </Card>
      </div>

      <Card>
        <div className="section-title">Settings</div>
        <div className="settings-row" onClick={() => setNotifications((n) => !n)}>
          <span>Reminder notifications</span>
          <div className={`toggle${notifications ? ' toggle--on' : ''}`}>
            <div className="toggle-knob" />
          </div>
        </div>
        <div className="settings-row">
          <span>Language</span>
          <span className="settings-value">English</span>
        </div>
        <div className="settings-row settings-row--danger" onClick={resetProgress}>
          <span>Reset progress</span>
          <Icon name="chevron-right" size={16} stroke={2} />
        </div>
      </Card>
    </div>
  );
}
