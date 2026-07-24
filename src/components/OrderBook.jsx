import { formatEUR, formatNumber } from '../utils/format';

export default function OrderBook({ bids, asks }) {
  const maxQty = Math.max(...bids.map((b) => b.qty), ...asks.map((a) => a.qty));
  const spread = asks[0].price - bids[0].price;
  const spreadPct = (spread / bids[0].price) * 100;

  return (
    <div className="order-book">
      <div className="order-book-col">
        {asks.slice().reverse().map((a) => (
          <Row key={a.price} price={a.price} qty={a.qty} maxQty={maxQty} tone="rose" />
        ))}
      </div>
      <div className="order-book-spread">
        Spread : {formatEUR(spread)} ({spreadPct.toFixed(2).replace('.', ',')} %)
      </div>
      <div className="order-book-col">
        {bids.map((b) => (
          <Row key={b.price} price={b.price} qty={b.qty} maxQty={maxQty} tone="teal" />
        ))}
      </div>
    </div>
  );
}

function Row({ price, qty, maxQty, tone }) {
  const pct = (qty / maxQty) * 100;
  return (
    <div className="order-book-row">
      <div className={`order-book-bar order-book-bar--${tone}`} style={{ width: `${pct}%` }} />
      <span className={`order-book-price order-book-price--${tone}`}>{formatEUR(price)}</span>
      <span className="order-book-qty">{formatNumber(qty, 1)}</span>
    </div>
  );
}
