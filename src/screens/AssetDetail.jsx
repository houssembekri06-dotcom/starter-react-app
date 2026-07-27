import { useState } from 'react';
import { useNavigate, useParams } from '@/lib/router-compat';
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
import { useLivePrice } from '../hooks/useLivePrice';
import InvestSheet from './InvestSheet';
import SellSheet from './SellSheet';
import PurchaseConfirmation from './PurchaseConfirmation';
import './AssetDetail.css';

const TIMEFRAMES = ['1D', '1W', '1M', '1Y', 'All'];

export default function AssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const asset = getAssetById(assetId);
  const { positions, completedLessonsCount, cashBalance, transactionFeeRate, buyAsset, sellAsset, lastCompletedLesson } = useProgress();

  const [timeframe, setTimeframe] = useState('1M');
  const [sheetMode, setSheetMode] = useState(null); // null | 'buy' | 'sell'
  const [confirmation, setConfirmation] = useState(null);

  // Live-ticking price + rolling chart for the viewed asset.
  const { price: livePrice, series: liveSeries, changePct: liveChangePct } = useLivePrice(asset);

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

  const gainLoss = position ? (livePrice - position.avgPrice) * position.shares : 0;
  const gainLossPct = position ? ((livePrice - position.avgPrice) / position.avgPrice) * 100 : 0;

  return (
    <div className="screen asset-detail-screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
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
          <div className="price-hero-value">{formatEUR(livePrice)}</div>
          <PriceChangeTag value={liveChangePct} />
          <span className="price-hero-live" aria-hidden="true">
            <span className="price-hero-live-dot" />
            LIVE
          </span>
        </div>
        <Sparkline data={liveSeries} width={310} height={70} positive={liveChangePct >= 0} fill />
      </Card>

      {/* Palier 2 */}
      {unlocked(2) && (
        <Card>
          <SectionTitle>Your position</SectionTitle>
          {position ? (
            <div className="position-grid">
              <PositionStat label="Shares held" value={`${formatShares(position.shares)}`} />
              <PositionStat label="Current value" value={formatEUR(position.shares * livePrice)} />
              <PositionStat
                label="Total gain / loss"
                value={`${gainLoss >= 0 ? '+' : ''}${formatEUR(gainLoss)}`}
                tone={gainLoss >= 0 ? 'teal' : 'rose'}
                sub={formatPercent(gainLossPct)}
              />
            </div>
          ) : (
            <p className="position-empty">Invest to see your position appear here.</p>
          )}
        </Card>
      )}

      {/* Palier 3 */}
      {unlocked(3) && (
        <Card>
          <SectionTitle>Price history</SectionTitle>
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
          <div className="range-52w-label">52-week range</div>
        </Card>
      )}

      {/* Palier 4 */}
      {unlocked(4) && (
        <Card>
          <SectionTitle>Purchase & fees</SectionTitle>
          <div className="kv-rows">
            <KvRow label="Average purchase price" value={position ? formatEUR(position.avgPrice) : '—'} />
            <KvRow label="Management fee (annual)" value={`${asset.managementFeePct.toFixed(2)}%`} />
          </div>
        </Card>
      )}

      {/* Palier 5 */}
      {unlocked(5) && asset.composition && (
        <Card>
          <SectionTitle>Fund composition</SectionTitle>
          <div className="composition-list">
            {asset.composition.map((c) => (
              <div key={c.name} className="composition-row">
                <div className="composition-bar-track">
                  <div className="composition-bar-fill" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="composition-name">{c.name}</span>
                <span className="composition-pct">{c.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Palier 6 */}
      {unlocked(6) && (
        <Card>
          <SectionTitle>Purchase history</SectionTitle>
          {position && position.purchases.length > 0 ? (
            <div className="history-list">
              {position.purchases.slice().reverse().map((p, i) => (
                <div key={i} className="history-row">
                  <span>{formatDate(p.date)}</span>
                  <span>{formatShares(p.shares)} shares</span>
                  <span>{formatEUR(p.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="position-empty">No purchases yet.</p>
          )}
          <div className="tip-box">
            <Icon name="info" size={16} stroke={2} color="var(--color-indigo)" />
            <span>Investing regularly, instead of all at once, smooths out your average purchase price over time.</span>
          </div>
        </Card>
      )}

      {/* Palier 7 */}
      {unlocked(7) && (
        <Card>
          <SectionTitle>Market data</SectionTitle>
          <div className="kv-rows">
            <KvRow label="Rank" value={`#${asset.rank}`} />
            <KvRow label="Market cap" value={formatCompactLarge(asset.marketCapEUR)} />
            {asset.dominancePct != null && <KvRow label="Dominance" value={`${asset.dominancePct}%`} />}
            <KvRow label="Average annual return" value={`${asset.avgAnnualReturnPct.toFixed(1)}%`} />
            <KvRow label="24h volume" value={formatCompactLarge(asset.volume24hEUR)} />
          </div>
        </Card>
      )}

      {/* Palier 8 */}
      {unlocked(8) && (
        <Card>
          <SectionTitle>Supply & all-time high</SectionTitle>
          <div className="kv-rows">
            <KvRow label="Circulating supply" value={`${formatCompactNumber(asset.circulatingSupply)} shares`} />
            <KvRow label="All-time high (ATH)" value={`${formatEUR(asset.ath)} · ${formatDate(asset.athDate)}`} />
            <KvRow label="24h range" value={`${formatEUR(asset.range24h.low)} – ${formatEUR(asset.range24h.high)}`} />
          </div>
        </Card>
      )}

      {/* Palier 9 */}
      {unlocked(9) && (
        <Card>
          <SectionTitle>Trading activity</SectionTitle>
          <div className="buysell-bar">
            <div className="buysell-buy" style={{ width: `${asset.buySellRatio.buyPct}%` }} />
          </div>
          <div className="buysell-labels">
            <span className="buysell-buy-label">{asset.buySellRatio.buyPct}% buyers</span>
            <span className="buysell-sell-label">{asset.buySellRatio.sellPct}% sellers</span>
          </div>
          <SectionTitle>About</SectionTitle>
          <p className="about-text">{asset.about}</p>
        </Card>
      )}

      {/* Palier 10 */}
      {unlocked(10) && (
        <Card>
          <SectionTitle>Candlestick chart</SectionTitle>
          <Candlestick candles={asset.candles} width={310} height={140} />
          <SectionTitle>Order book</SectionTitle>
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
            <button className="btn btn-rose-outline" onClick={() => setSheetMode('sell')}>Sell</button>
            <button className="btn btn-primary" onClick={() => setSheetMode('buy')}>Invest more</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => setSheetMode('buy')}>Invest</button>
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
