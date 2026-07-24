import Icon from './Icon';
import { formatPercent } from '../utils/format';

export default function PriceChangeTag({ value, size = 'md' }) {
  const positive = value >= 0;
  return (
    <span className={`price-change price-change--${positive ? 'up' : 'down'} price-change--${size}`}>
      <Icon name={positive ? 'trending-up' : 'trending-down'} size={size === 'sm' ? 13 : 15} stroke={2.3} />
      {formatPercent(value)}
    </span>
  );
}
