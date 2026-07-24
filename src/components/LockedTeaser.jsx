import Icon from './Icon';

export default function LockedTeaser({ title, lessonsRemaining }) {
  return (
    <div className="locked-teaser">
      <div className="locked-teaser-icon">
        <Icon name="lock" size={18} stroke={2} color="var(--color-text-disabled)" />
      </div>
      <div className="locked-teaser-text">
        <div className="locked-teaser-title">{title}</div>
        <div className="locked-teaser-hint">
          {lessonsRemaining > 0
            ? `Débloqué dans ${lessonsRemaining} leçon${lessonsRemaining > 1 ? 's' : ''}`
            : 'Débloqué bientôt'}
        </div>
      </div>
    </div>
  );
}
