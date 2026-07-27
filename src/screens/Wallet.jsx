import { useNavigate } from '@/lib/router-compat';
import { useProgress } from '../context/ProgressContext';
import { getAssetById, ASSETS, ASSET_TYPE_LABELS } from '../data/assets';
import { formatEUR, formatShares } from '../utils/format';
import { useLiveMarket } from '../hooks/useLivePrice';
import Sparkline from '../components/Sparkline';
import PriceChangeTag from '../components/PriceChangeTag';
import SimulationBadge from '../components/SimulationBadge';
import { Card } from '../components/Card';
import './Wallet.css';

export default function Wallet() {
  const { positions, cashBalance } = useProgress();
  const navigate = useNavigate();
  const live = useLiveMarket(ASSETS);

  const heldAssetIds = Object.keys(positions);
  const hasPositions = heldAssetIds.length > 0;

  const priceOf = (id) => live[id]?.price ?? getAssetById(id)?.price ?? 0;

  // Live portfolio value + aggregate chart, recomputed every tick.
  const portfolioValue = heldAssetIds.reduce((sum, id) => sum + priceOf(id) * positions[id].shares, 0);

  let dayChangeEUR = 0;
  let dayChangePct = 0;
  const aggregateSparkline = [];
  if (hasPositions) {
    const held = heldAssetIds.map((id) => ({
      shares: positions[id].shares,
      series: live[id]?.series ?? getAssetById(id)?.sparkline ?? [],
      dayOpen: live[id]?.dayOpen ?? getAssetById(id)?.price ?? 0,
    }));
    const len = Math.min(...held.map((h) => h.series.length).filter((n) => n > 0), 44) || 0;
    for (let i = 0; i < len; i++) {
      let v = 0;
      for (const h of held) v += h.shares * h.series[h.series.length - len + i];
      aggregateSparkline.push(v);
    }
    const prevValue = held.reduce((s, h) => s + h.dayOpen * h.shares, 0);
    dayChangeEUR = portfolioValue - prevValue;
    dayChangePct = prevValue > 0 ? (dayChangeEUR / prevValue) * 100 : 0;
  }

  return (
    <div className="screen wallet-screen">
      <div className="wallet-hero">
        <div className="wallet-hero-label">Total portfolio value</div>
        <div className="wallet-hero-value">{formatEUR(portfolioValue)}</div>
        {hasPositions && (
          <div className="wallet-hero-change">
            <PriceChangeTag value={dayChangePct} />
            <span className="wallet-hero-change-eur">
              {dayChangeEUR >= 0 ? '+' : ''}{formatEUR(dayChangeEUR)} today
            </span>
          </div>
        )}
        {hasPositions && aggregateSparkline.length > 1 && (
          <div className="wallet-hero-spark">
            <Sparkline data={aggregateSparkline} width={342} height={64} positive={dayChangeEUR >= 0} fill />
          </div>
        )}
        <div className="wallet-hero-cash">Available balance: {formatEUR(cashBalance)}</div>
        <SimulationBadge compact />
      </div>

      <div className="section-title-row">
        <h3 className="section-title">Your holdings</h3>
      </div>

      {!hasPositions ? (
        <Card className="wallet-empty">
          <p>You don't hold any assets yet.</p>
          <p className="wallet-empty-sub">Complete a lesson to unlock your first investment.</p>
        </Card>
      ) : (
        <div className="asset-grid">
          {heldAssetIds.map((assetId) => {
            const asset = getAssetById(assetId);
            const pos = positions[assetId];
            if (!asset) return null;
            const m = live[assetId];
            const price = m?.price ?? asset.price;
            const change = m?.changePct ?? asset.dayChangePct;
            const series = m?.series ?? asset.sparkline;
            return (
              <Card key={assetId} className="asset-card" onClick={() => navigate(`/asset/${assetId}`)}>
                <div className="asset-card-top">
                  <span className="asset-card-symbol">{asset.symbol}</span>
                  <PriceChangeTag value={change} size="sm" />
                </div>
                <div className="asset-card-name">{asset.name}</div>
                <Sparkline data={series} width={120} height={30} positive={change >= 0} />
                <div className="asset-card-value">{formatEUR(price * pos.shares)}</div>
                <div className="asset-card-shares">{formatShares(pos.shares)} shares</div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="section-title-row">
        <h3 className="section-title">Discover</h3>
      </div>
      <div className="explore-list">
        {ASSETS.filter((a) => !heldAssetIds.includes(a.id)).map((asset) => {
          const m = live[asset.id];
          const price = m?.price ?? asset.price;
          const change = m?.changePct ?? asset.dayChangePct;
          return (
            <button key={asset.id} className="explore-row" onClick={() => navigate(`/asset/${asset.id}`)}>
              <div>
                <div className="explore-row-name">{asset.name}</div>
                <div className="explore-row-type">{ASSET_TYPE_LABELS[asset.type]}</div>
              </div>
              <div className="explore-row-right">
                <span className="explore-row-price">{formatEUR(price)}</span>
                <PriceChangeTag value={change} size="sm" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
