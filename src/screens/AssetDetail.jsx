import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { getAssetById, ASSET_TYPE_LABELS } from '../data/assets';
import { ASSET_DISCLOSURE_LEVELS, isUnlocked, nextUnlock } from '../data/disclosure';
import { formatEUR, formatPercent, formatShares, formatDate, formatCompactLarge, formatCompactNumber } from '../utils/format';
import Icon from '../components/Icon';
import Sparkline from '../components/Sparkline';
import Candlestick from '../components/Candlestick';
import OrderBook from '../components/OrderBook';
import PriceChangeTag from '../components/PriceChangeTag';
import LockedTeaser from '../components/LockedTeaser';
import SimulationBadge from '../components/SimulationBadge';
import { Card, SectionTitle } from '../components/Card';
import InvestSheet from './InvestSheet';
import SellSheet from './SellSheet';
import PurchaseConfirmation from './PurchaseConfirmation';
import './AssetDetail.css';

const TIMEFRAMES = ['1J', '1S', '1M', '1A', 'Tout'];

export default function AssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const asset = getAssetById(assetId);
  const { positions, completedLessonsCount, cashBalance, transactionFeeRate, buyAsset, sellAsset, lastCompletedLesson } = useProgress();

  const [timeframe, setTimeframe] = useState('1M');
  const [sheetMode, setSheetMode] = useState(null); // null | 'buy' | 'sell'
  const [confirmation, setConfirmation] = useState(null);

  if (!asset) return null;
  const position = positions[assetId];

  const unlocked = (n) => isUnlocked(completedLessonsCount, ASSET_DISCLOSURE_LEVELS, n);
  const remainingFor = (n) => nextUnlock(completedLessonsCount, ASSET_DISCLOSURE_LEVELS, n);
  const nextLockedLevel = ASSET_DISCLOSURE_LEVELS.find((l) => !unlocked(l.level));

  function handleConfirmPurchase(params) {
    const result = buyAsset(params);
    if (!result) return;
    setSheetMode(null);
    setConfirmation(result);
  }

  function handleConfirmSale(shares) {
    sellAsset(assetId, shares);
    setSheetMode(null);
  }

  if (confirmation) {
    return (
      <PurchaseConfirmation
        asset={asset}
        result={confirmation}
        lessonBadge={lastCompletedLesson}
        onBack={() => navigate('/wallet')}
      />
    );
  }

  const gainLoss = position ? (asset.price - position.avgPrice) * position.shares : 0;
  const gainLossPct = position ? ((asset.price - position.avgPrice) / position.avgPrice) * 100 : 0;

  return (
    <div className="screen asset-detail-screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Retour">
          <Icon name="back" size={17} stroke={2.2} />
        </button>
        <div>
          <div className="asset-detail-name">{asset.name}</div>
          <div className="asset-detail-type">{ASSET_TYPE_LABELS[asset.type]} · {asset.symbol}</div>
        </div>
      </div>

      {/* Palier 1 */}
      <Card>
        <div className="price-hero">
          <div className="price-hero-value">{formatEUR(asset.price)}</div>
          <PriceChangeTag value={asset.dayChangePct} />
        </div>
        <Sparkline data={asset.sparkline} width={310} height={70} positive={asset.dayChangePct >= 0} fill />
      </Card>

      {/* Palier 2 */}
      {unlocked(2) && (
        <Card>
          <SectionTitle>Votre position</SectionTitle>
          {position ? (
            <div className="position-grid">
              <PositionStat label="Parts détenues" value={`${formatShares(position.shares)}`} />
              <PositionStat label="Valeur actuelle" value={formatEUR(position.shares * asset.price)} />
              <PositionStat
                label="Gain / perte total"
                value={`${gainLoss >= 0 ? '+' : ''}${formatEUR(gainLoss)}`}
                tone={gainLoss >= 0 ? 'teal' : 'rose'}
                sub={formatPercent(gainLossPct)}
              />
            </div>
          ) : (
            <p className="position-empty">Investissez pour voir apparaître votre position ici.</p>
          )}
        </Card>
      )}

      {/* Palier 3 */}
      {unlocked(3) && (
        <Card>
          <SectionTitle>Évolution du prix</SectionTitle>
          <div className="timeframe-row">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                className={`timeframe-btn${timeframe === tf ? ' timeframe-btn--active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
          <Sparkline data={asset.ranges[timeframe]} width={310} height={90} positive={asset.dayChangePct >= 0} fill />
          <div className="range-52w">
            <span>{formatEUR(asset.range52w.low)}</span>
            <div className="range-52w-track">
              <div
                className="range-52w-marker"
                style={{
                  left: `${((asset.price - asset.range52w.low) / (asset.range52w.high - asset.range52w.low)) * 100}%`,
                }}
              />
            </div>
            <span>{formatEUR(asset.range52w.high)}</span>
          </div>
          <div className="range-52w-label">Range 52 semaines</div>
        </Card>
      )}

      {/* Palier 4 */}
      {unlocked(4) && (
        <Card>
          <SectionTitle>Achat & frais</SectionTitle>
          <div className="kv-rows">
            <KvRow label="Prix moyen d'achat" value={position ? formatEUR(position.avgPrice) : '—'} />
            <KvRow label="Frais de gestion (annuel)" value={`${asset.managementFeePct.toFixed(2).replace('.', ',')} %`} />
          </div>
        </Card>
      )}

      {/* Palier 5 */}
      {unlocked(5) && asset.composition && (
        <Card>
          <SectionTitle>Composition du fonds</SectionTitle>
          <div className="composition-list">
            {asset.composition.map((c) => (
              <div key={c.name} className="composition-row">
                <div className="composition-bar-track">
                  <div className="composition-bar-fill" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="composition-name">{c.name}</span>
                <span className="composition-pct">{c.pct.toFixed(1).replace('.', ',')} %</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Palier 6 */}
      {unlocked(6) && (
        <Card>
          <SectionTitle>Historique d'achats</SectionTitle>
          {position && position.purchases.length > 0 ? (
            <div className="history-list">
              {position.purchases.slice().reverse().map((p, i) => (
                <div key={i} className="history-row">
                  <span>{formatDate(p.date)}</span>
                  <span>{formatShares(p.shares)} parts</span>
                  <span>{formatEUR(p.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="position-empty">Aucun achat pour le moment.</p>
          )}
          <div className="tip-box">
            <Icon name="info" size={16} stroke={2} color="var(--color-indigo)" />
            <span>Investir régulièrement, plutôt qu'en une seule fois, lisse votre prix moyen d'achat dans le temps.</span>
          </div>
        </Card>
      )}

      {/* Palier 7 */}
      {unlocked(7) && (
        <Card>
          <SectionTitle>Données de marché</SectionTitle>
          <div className="kv-rows">
            <KvRow label="Classement" value={`#${asset.rank}`} />
            <KvRow label="Capitalisation" value={formatCompactLarge(asset.marketCapEUR)} />
            {asset.dominancePct != null && <KvRow label="Prédominance" value={`${asset.dominancePct} %`} />}
            <KvRow label="Rendement annuel moyen" value={`${asset.avgAnnualReturnPct.toFixed(1).replace('.', ',')} %`} />
            <KvRow label="Volume 24h" value={formatCompactLarge(asset.volume24hEUR)} />
          </div>
        </Card>
      )}

      {/* Palier 8 */}
      {unlocked(8) && (
        <Card>
          <SectionTitle>Offre & plus haut historique</SectionTitle>
          <div className="kv-rows">
            <KvRow label="Offre en circulation" value={`${formatCompactNumber(asset.circulatingSupply)} parts`} />
            <KvRow label="Plus haut historique (ATH)" value={`${formatEUR(asset.ath)} · ${formatDate(asset.athDate)}`} />
            <KvRow label="Range 24h" value={`${formatEUR(asset.range24h.low)} – ${formatEUR(asset.range24h.high)}`} />
          </div>
        </Card>
      )}

      {/* Palier 9 */}
      {unlocked(9) && (
        <Card>
          <SectionTitle>Activité de trading</SectionTitle>
          <div className="buysell-bar">
            <div className="buysell-buy" style={{ width: `${asset.buySellRatio.buyPct}%` }} />
          </div>
          <div className="buysell-labels">
            <span className="buysell-buy-label">{asset.buySellRatio.buyPct}% acheteurs</span>
            <span className="buysell-sell-label">{asset.buySellRatio.sellPct}% vendeurs</span>
          </div>
          <SectionTitle>À propos</SectionTitle>
          <p className="about-text">{asset.about}</p>
        </Card>
      )}

      {/* Palier 10 */}
      {unlocked(10) && (
        <Card>
          <SectionTitle>Bougies japonaises</SectionTitle>
          <Candlestick candles={asset.candles} width={310} height={140} />
          <SectionTitle>Carnet d'ordres</SectionTitle>
          <OrderBook bids={asset.orderBook.bids} asks={asset.orderBook.asks} />
        </Card>
      )}

      {nextLockedLevel && (
        <LockedTeaser title={nextLockedLevel.label} lessonsRemaining={remainingFor(nextLockedLevel.level)} />
      )}

      <SimulationBadge />

      <div className="asset-detail-actions">
        {position ? (
          <>
            <button className="btn btn-rose-outline" onClick={() => setSheetMode('sell')}>Vendre</button>
            <button className="btn btn-primary" onClick={() => setSheetMode('buy')}>Investir plus</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => setSheetMode('buy')}>Investir</button>
        )}
      </div>

      {sheetMode === 'buy' && (
        <InvestSheet
          asset={asset}
          position={position}
          completedLessonsCount={completedLessonsCount}
          cashBalance={cashBalance}
          feeRate={transactionFeeRate}
          onClose={() => setSheetMode(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}

      {sheetMode === 'sell' && position && (
        <SellSheet
          asset={asset}
          position={position}
          feeRate={transactionFeeRate}
          onClose={() => setSheetMode(null)}
          onConfirm={handleConfirmSale}
        />
      )}
    </div>
  );
}

function PositionStat({ label, value, tone, sub }) {
  return (
    <div className="position-stat">
      <div className="position-stat-label">{label}</div>
      <div className={`position-stat-value${tone ? ` position-stat-value--${tone}` : ''}`}>{value}</div>
      {sub && <div className={`position-stat-sub position-stat-sub--${tone}`}>{sub}</div>}
    </div>
  );
}

function KvRow({ label, value }) {
  return (
    <div className="kv-row">
      <span className="kv-label">{label}</span>
      <span className="kv-value">{value}</span>
    </div>
  );
}
