import { useEffect, useState } from 'react';
import Icon from './Icon';
import './MarketTicker.css';

// Crypto is fetched live from CoinGecko's free, key-less, CORS-enabled API.
// `coinId` is the CoinGecko id used in the request.
const CRYPTO = [
  { symbol: 'BTC', name: 'Bitcoin', coinId: 'bitcoin', price: 64230, change: 2.15 },
  { symbol: 'ETH', name: 'Ethereum', coinId: 'ethereum', price: 3450, change: 1.08 },
  { symbol: 'SOL', name: 'Solana', coinId: 'solana', price: 145, change: 3.2 },
  { symbol: 'BNB', name: 'BNB', coinId: 'binancecoin', price: 590, change: 0.8 },
  { symbol: 'XRP', name: 'XRP', coinId: 'ripple', price: 0.52, change: -1.1 },
  { symbol: 'DOGE', name: 'Dogecoin', coinId: 'dogecoin', price: 0.12, change: 1.5 },
];

// Stocks/indices/commodities stay simulated (real quotes need a paid API key).
const STOCKS = [
  { symbol: 'AAPL', name: 'Apple', price: 187.45, change: 1.24 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.18, change: -0.86 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 124.3, change: 3.21 },
  { symbol: 'SP500', name: 'S&P 500', price: 5480.15, change: 0.52 },
  { symbol: 'GOLD', name: 'Gold', price: 2354.6, change: 0.33 },
];

// Interleave crypto and stocks for visual variety.
const INITIAL = [];
for (let i = 0; i < Math.max(CRYPTO.length, STOCKS.length); i++) {
  if (CRYPTO[i]) INITIAL.push(CRYPTO[i]);
  if (STOCKS[i]) INITIAL.push(STOCKS[i]);
}

const COIN_IDS = CRYPTO.map((c) => c.coinId).join(',');
const COINGECKO_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true`;

function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export default function MarketTicker() {
  const [quotes, setQuotes] = useState(INITIAL);
  const [live, setLive] = useState(false);

  // Poll real crypto prices from CoinGecko; fall back silently to the seeded
  // values if the request fails (offline / rate-limited).
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch(COINGECKO_URL, { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setQuotes((prev) =>
          prev.map((q) => {
            const d = q.coinId ? data[q.coinId] : null;
            if (!d || typeof d.usd !== 'number') return q;
            return {
              ...q,
              flash: d.usd > q.price ? 'up' : d.usd < q.price ? 'down' : q.flash,
              price: d.usd,
              change: Number((d.usd_24h_change ?? q.change).toFixed(2)),
            };
          })
        );
        setLive(true);
      } catch {
        /* keep the simulated fallback */
      }
    }
    load();
    const iv = setInterval(load, 45000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  // Simulated micro-drift for the non-crypto (stock) symbols only, so the strip
  // still feels alive between crypto refreshes. Real crypto values are left as
  // fetched.
  useEffect(() => {
    const iv = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          if (q.coinId) return q.flash ? { ...q, flash: null } : q;
          if (Math.random() > 0.4) return q.flash ? { ...q, flash: null } : q;
          const drift = (Math.random() - 0.5) * 0.5;
          return {
            ...q,
            price: Number((q.price * (1 + drift / 100)).toFixed(2)),
            change: Number((q.change + drift).toFixed(2)),
            flash: drift >= 0 ? 'up' : 'down',
          };
        })
      );
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  // Double the list for a seamless infinite scroll loop.
  const items = [...quotes, ...quotes].map((item, i) => ({ ...item, key: `${item.symbol}-${i}` }));

  return (
    <div
      className="market-ticker"
      aria-label={live ? 'Live crypto and simulated market quotes' : 'Simulated market quotes'}
    >
      <div className={`market-ticker-live${live ? ' is-on' : ''}`} aria-hidden="true">
        <span className="market-ticker-live-dot" />
        LIVE
      </div>
      <div className="market-ticker-scroll">
        <div className="market-ticker-track">
          {items.map((item) => {
            const isPositive = item.change >= 0;
            const flashClass = item.flash ? ` market-ticker-item--flash-${item.flash}` : '';
            return (
              <div key={item.key} className={`market-ticker-item${flashClass}`}>
                <span className="market-ticker-symbol">{item.symbol}</span>
                <span className="market-ticker-price">{formatPrice(item.price)}</span>
                <span className={`market-ticker-change ${isPositive ? 'market-ticker-change--up' : 'market-ticker-change--down'}`}>
                  <Icon name={isPositive ? 'arrow-up-right' : 'arrow-down-right'} size={12} stroke={2.4} />
                  {isPositive ? '+' : ''}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
