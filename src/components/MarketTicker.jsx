import { useEffect, useState } from 'react';
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
  { symbol: 'GOLD', name: 'Gold', price: 2354.6, change: +0.33 },
];

function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return price.toFixed(price >= 100 ? 2 : 4);
}

export default function MarketTicker() {
  // Start from the static list (deterministic first paint), then let the
  // quotes drift live on the client so the ticker feels like a real feed.
  const [quotes, setQuotes] = useState(TICKER_ITEMS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          // Nudge only ~40% of symbols each beat so it looks organic.
          if (Math.random() > 0.4) return q.flash ? { ...q, flash: null } : q;
          const drift = (Math.random() - 0.5) * 0.5; // ±0.25 percentage points
          const decimals = q.price >= 1000 ? 2 : q.price >= 100 ? 2 : 4;
          return {
            ...q,
            price: Number((q.price * (1 + drift / 100)).toFixed(decimals)),
            change: Number((q.change + drift).toFixed(2)),
            flash: drift >= 0 ? 'up' : 'down',
          };
        })
      );
      setTick((t) => t + 1);
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  // Double the list for a seamless infinite scroll loop.
  const items = [...quotes, ...quotes].map((item, i) => ({ ...item, key: `${item.symbol}-${i}` }));

  return (
    <div className="market-ticker" aria-label="Fictional market quotes (simulated)">
      <div className="market-ticker-track">
        {items.map((item) => {
          const isPositive = item.change >= 0;
          const flashClass = item.flash ? ` market-ticker-item--flash-${item.flash}` : '';
          return (
            <div key={item.key} className={`market-ticker-item${flashClass}`}>
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
