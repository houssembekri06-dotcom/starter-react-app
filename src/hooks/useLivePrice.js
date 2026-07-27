import { useEffect, useRef, useState } from 'react';

// Number of points kept in the rolling live chart window.
const WINDOW = 44;
const TICK_MS = 1000;

// Simulates a live price for a (fictional) asset: the price random-walks from
// its seeded value and a rolling series is appended each tick, so the chart
// visibly moves. Client-only (uses Math.random / setInterval).
export function useLivePrice(asset) {
  const base = asset?.price ?? 0;
  const vol = asset?.volatility ?? 0.012;
  const dayOpen = base / (1 + (asset?.dayChangePct ?? 0) / 100) || base;

  const [price, setPrice] = useState(base);
  const [series, setSeries] = useState(() =>
    asset?.sparkline?.length ? asset.sparkline.slice(-WINDOW) : [base]
  );
  const priceRef = useRef(base);

  // Reset when the viewed asset changes.
  useEffect(() => {
    priceRef.current = base;
    setPrice(base);
    setSeries(asset?.sparkline?.length ? asset.sparkline.slice(-WINDOW) : [base]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.id]);

  useEffect(() => {
    if (!asset) return undefined;
    const iv = setInterval(() => {
      const cur = priceRef.current;
      // Dampened per-tick step so the price wobbles realistically rather than
      // swinging wildly each second.
      const delta = (Math.random() - 0.5) * vol * 0.35 * cur;
      const next = Math.max(cur * 0.5, cur + delta);
      priceRef.current = next;
      setPrice(next);
      setSeries((prev) => {
        const arr = prev.length >= WINDOW ? prev.slice(1) : prev.slice();
        arr.push(next);
        return arr;
      });
    }, TICK_MS);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.id, vol]);

  const changePct = dayOpen ? ((price - dayOpen) / dayOpen) * 100 : 0;
  return { price, series, changePct };
}

// Same idea but for a whole list of assets at once (e.g. the portfolio page):
// returns a map assetId -> { price, series, changePct, dayOpen }. Pass a stable
// array (a module-level constant) so the ticking interval isn't recreated.
export function useLiveMarket(assets) {
  const [market, setMarket] = useState(() => {
    const m = {};
    for (const a of assets) {
      m[a.id] = {
        price: a.price,
        series: a.sparkline?.length ? a.sparkline.slice(-WINDOW) : [a.price],
        dayOpen: a.price / (1 + (a.dayChangePct ?? 0) / 100) || a.price,
      };
    }
    return m;
  });

  useEffect(() => {
    const iv = setInterval(() => {
      setMarket((prev) => {
        const next = {};
        for (const a of assets) {
          const cur = prev[a.id] || {
            price: a.price,
            series: [a.price],
            dayOpen: a.price,
          };
          const vol = a.volatility ?? 0.012;
          const delta = (Math.random() - 0.5) * vol * 0.35 * cur.price;
          const p = Math.max(cur.price * 0.5, cur.price + delta);
          const series = cur.series.length >= WINDOW ? cur.series.slice(1) : cur.series.slice();
          series.push(p);
          next[a.id] = { price: p, series, dayOpen: cur.dayOpen };
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [assets]);

  const out = {};
  for (const id in market) {
    const m = market[id];
    out[id] = { ...m, changePct: m.dayOpen ? ((m.price - m.dayOpen) / m.dayOpen) * 100 : 0 };
  }
  return out;
}
