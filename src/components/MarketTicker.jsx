import { useMemo } from 'react';
import Icon from './Icon';
import './MarketTicker.css';

const TICKER_ITEMS = [
  { symbol: 'AAPL', name: 'Apple', price: 187.45, change: +1.24 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.18, change: -0.86 },
  { symbol: 'BTC', name: 'Bitcoin', price: 64230.0, change: +2.15 },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.2, change: +1.08 },
  { symbol: 'EUR/USD', name: 'Euro/Dollar', price: 1.0845, change: -0.12 },
  { symbol: 'CAC 40', name: 'France', price: 8012.35, change: +0.74 },
  { symbol: 'SP500', name: 'S&P 500', price: 5480.15, change: +0.52 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 124.3, change: +3.21 },
  { symbol: 'AMZN', name: 'Amazon', price: 198.75, change: -0.45 },
  { symbol: 'GOLD', name: 'Or', price: 2354.6, change: +0.33 },
];

function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  return price.toFixed(price >= 100 ? 2 : 4);
}

export default function MarketTicker() {
  const items = useMemo(() => {
    // Double the list for a seamless infinite scroll loop
    const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
    return doubled.map((item, i) => ({ ...item, key: `${item.symbol}-${i}` }));
  }, []);

  return (
    <div className="market-ticker" aria-label="Cours de marché fictifs">
      <div className="market-ticker-track">
        {items.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div key={item.key} className="market-ticker-item">
              <span className="market-ticker-symbol">{item.symbol}</span>
              <span className="market-ticker-price">{formatPrice(item.price)}</span>
              <span className={`market-ticker-change ${isPositive ? 'market-ticker-change--up' : 'market-ticker-change--down'}`}>
                <Icon
                  name={isPositive ? 'arrow-up-right' : 'arrow-down-right'}
                  size={12}
                  stroke={2.4}
                />
                {isPositive ? '+' : ''}
                {item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
