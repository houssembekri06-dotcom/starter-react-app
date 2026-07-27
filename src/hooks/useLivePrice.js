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
