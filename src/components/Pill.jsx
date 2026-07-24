import Icon from './Icon';

export default function Pill({ icon, iconColor, children, tone = 'neutral' }) {
  return (
    <div className={`pill pill--${tone}`}>
      {icon && <Icon name={icon} size={15} stroke={2.2} color={iconColor} />}
      <span>{children}</span>
    </div>
  );
}
