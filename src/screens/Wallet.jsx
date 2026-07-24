import { useMemo } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { useProgress } from '../context/ProgressContext';
import { getAssetById, ASSETS, ASSET_TYPE_LABELS } from '../data/assets';
import { formatEUR, formatShares } from '../utils/format';
import Sparkline from '../components/Sparkline';
import PriceChangeTag from '../components/PriceChangeTag';
import SimulationBadge from '../components/SimulationBadge';
import { Card } from '../components/Card';
import './Wallet.css';

export default function Wallet() {
  const { positions, portfolioValue, cashBalance } = useProgress();
  const navigate = useNavigate();

  const heldAssetIds = Object.keys(positions);

  const { dayChangeEUR, dayChangePct, aggregateSparkline } = useMemo(() => {
    let prevValue = 0;
    const spark = new Array(24).fill(0);
    heldAssetIds.forEach((assetId) => {
      const asset = getAssetById(assetId);
      const pos = positions[assetId];
      if (!asset || !pos) return;
      const prevPrice = asset.price / (1 + asset.dayChangePct / 100);
      prevValue += prevPrice * pos.shares;
      asset.sparkline.forEach((p, i) => { spark[i] += p * pos.shares; });
    });
    const change = portfolioValue - prevValue;
    const pct = prevValue > 0 ? (change / prevValue) * 100 : 0;
    return { dayChangeEUR: change, dayChangePct: pct, aggregateSparkline: spark };
  }, [positions, portfolioValue, heldAssetIds]);

  const hasPositions = heldAssetIds.length > 0;

  return (
    <div className="screen wallet-screen">
      <div className="wallet-hero">
        <div className="wallet-hero-label">Valeur totale investie</div>
        <div className="wallet-hero-value">{formatEUR(portfolioValue)}</div>
        {hasPositions && (
          <div className="wallet-hero-change">
            <PriceChangeTag value={dayChangePct} />
            <span className="wallet-hero-change-eur">
              {dayChangeEUR >= 0 ? '+' : ''}{formatEUR(dayChangeEUR)} aujourd'hui
            </span>
          </div>
        )}
        {hasPositions && (
          <div className="wallet-hero-spark">
            <Sparkline data={aggregateSparkline} width={342} height={64} positive={dayChangeEUR >= 0} fill />
          </div>
        )}
        <div className="wallet-hero-cash">Solde disponible : {formatEUR(cashBalance)}</div>
        <SimulationBadge compact />
      </div>

      <div className="section-title-row">
        <h3 className="section-title">Vos actifs</h3>
      </div>

      {!hasPositions ? (
        <Card className="wallet-empty">
          <p>Vous ne détenez encore aucun actif.</p>
          <p className="wallet-empty-sub">Terminez une leçon pour débloquer votre premier investissement.</p>
        </Card>
      ) : (
        <div className="asset-grid">
          {heldAssetIds.map((assetId) => {
            const asset = getAssetById(assetId);
            const pos = positions[assetId];
            if (!asset) return null;
            const value = asset.price * pos.shares;
            return (
              <Card key={assetId} className="asset-card" onClick={() => navigate(`/asset/${assetId}`)}>
                <div className="asset-card-top">
                  <span className="asset-card-symbol">{asset.symbol}</span>
                  <PriceChangeTag value={asset.dayChangePct} size="sm" />
                </div>
                <div className="asset-card-name">{asset.name}</div>
                <Sparkline data={asset.sparkline} width={120} height={30} positive={asset.dayChangePct >= 0} />
                <div className="asset-card-value">{formatEUR(value)}</div>
                <div className="asset-card-shares">{formatShares(pos.shares)} parts</div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="section-title-row">
        <h3 className="section-title">Découvrir</h3>
      </div>
      <div className="explore-list">
        {ASSETS.filter((a) => !heldAssetIds.includes(a.id)).map((asset) => (
          <button key={asset.id} className="explore-row" onClick={() => navigate(`/asset/${asset.id}`)}>
            <div>
              <div className="explore-row-name">{asset.name}</div>
              <div className="explore-row-type">{ASSET_TYPE_LABELS[asset.type]}</div>
            </div>
            <div className="explore-row-right">
              <span className="explore-row-price">{formatEUR(asset.price)}</span>
              <PriceChangeTag value={asset.dayChangePct} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
