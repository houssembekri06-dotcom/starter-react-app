import { useMemo, useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import LockedTeaser from '../components/LockedTeaser';
import SimulationBadge from '../components/SimulationBadge';
import { INVEST_DISCLOSURE_LEVELS, getDisclosureLevel, isUnlocked, nextUnlock } from '../data/disclosure';
import { formatEUR, formatShares } from '../utils/format';
import './InvestSheet.css';

const QUICK_AMOUNTS = [50, 100, 250];

export default function InvestSheet({ asset, position, completedLessonsCount, cashBalance, feeRate, onClose, onConfirm }) {
  const level = getDisclosureLevel(completedLessonsCount, INVEST_DISCLOSURE_LEVELS);
  const unlocked = (n) => isUnlocked(completedLessonsCount, INVEST_DISCLOSURE_LEVELS, n);

  const [amount, setAmount] = useState(100);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState(asset.price.toFixed(2));
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const fees = amount * feeRate;
  const execPrice = orderType === 'limit' && limitPrice ? Number(limitPrice) : asset.price;
  const sharesBought = amount > 0 ? (amount - fees) / execPrice : 0;

  const existingShares = position?.shares || 0;
  const existingAvg = position?.avgPrice || 0;
  const newTotalShares = existingShares + sharesBought;
  const newAvgPrice = newTotalShares > 0
    ? (existingShares * existingAvg + sharesBought * execPrice) / newTotalShares
    : 0;

  const insufficientFunds = amount > cashBalance;
  const nextLevelInfo = level < 6 ? INVEST_DISCLOSURE_LEVELS.find((l) => l.level === level + 1) : null;

  function handleConfirm() {
    if (amount <= 0 || insufficientFunds) return;
    onConfirm({
      assetId: asset.id,
      amountEUR: amount,
      orderType: unlocked(4) ? orderType : 'market',
      limitPrice: unlocked(4) && orderType === 'limit' ? Number(limitPrice) : undefined,
      stopLoss: unlocked(5) && stopLoss ? Number(stopLoss) : undefined,
      takeProfit: unlocked(5) && takeProfit ? Number(takeProfit) : undefined,
    });
  }

  return (
    <BottomSheet open onClose={onClose} title={`Invest in ${asset.symbol}`}>
      <div className="invest-sheet">
        {/* Level 1 — montant */}
        <div className="invest-section">
          <label className="invest-label">Amount to invest</label>
          <div className="invest-amount-display">{formatEUR(amount)}</div>
          <div className="quick-amounts-row">
            {QUICK_AMOUNTS.map((v) => (
              <button
                key={v}
                className={`quick-amount-btn${amount === v ? ' quick-amount-btn--active' : ''}`}
                onClick={() => setAmount(v)}
              >
                ${v}
              </button>
            ))}
            <button
              className={`quick-amount-btn${amount === Math.floor(cashBalance) ? ' quick-amount-btn--active' : ''}`}
              onClick={() => setAmount(Math.floor(cashBalance))}
            >
              Max
            </button>
          </div>
        </div>

        {/* Level 2 — frais + solde */}
        {unlocked(2) && (
          <div className="invest-mini-rows">
            <MiniRow label="Transaction fees" value={formatEUR(fees)} />
            <MiniRow label="Available balance" value={formatEUR(cashBalance)} warn={insufficientFunds} />
          </div>
        )}

        {/* Level 3 — aperçu après achat */}
        {unlocked(3) && amount > 0 && (
          <div className="invest-preview">
            <div className="invest-preview-title">Preview after purchase</div>
            <MiniRow label="Total shares" value={`${formatShares(newTotalShares)} shares`} />
            <MiniRow label="New average price" value={formatEUR(newAvgPrice)} />
          </div>
        )}

        {/* Level 4 — type d'ordre */}
        {unlocked(4) && (
          <div className="invest-section">
            <label className="invest-label">Order type</label>
            <div className="order-type-row">
              <button
                className={`quick-amount-btn${orderType === 'market' ? ' quick-amount-btn--active' : ''}`}
                onClick={() => setOrderType('market')}
              >
                Market
              </button>
              <button
                className={`quick-amount-btn${orderType === 'limit' ? ' quick-amount-btn--active' : ''}`}
                onClick={() => setOrderType('limit')}
              >
                Limit
              </button>
            </div>
            {orderType === 'limit' && (
              <input
                type="number"
                className="invest-input"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="Limit price ($)"
              />
            )}
          </div>
        )}

        {/* Level 5 — protections */}
        {unlocked(5) && (
          <div className="invest-section">
            <label className="invest-label">Protections (optional)</label>
            <div className="protections-row">
              <input
                type="number"
                className="invest-input"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Stop-loss ($)"
              />
              <input
                type="number"
                className="invest-input"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="Take-profit ($)"
              />
            </div>
          </div>
        )}

        {/* Level 6 — détails pro */}
        {unlocked(6) && (
          <div className="invest-mini-rows">
            <MiniRow label="Estimated execution price" value={formatEUR(execPrice)} />
            <MiniRow label="Maker / taker fees" value={orderType === 'limit' ? '0.10% / 0.20%' : '0.20% / 0.20%'} />
            <MiniRow label="Slippage tolerance" value="0.50% max" />
          </div>
        )}

        {nextLevelInfo && (
          <LockedTeaser
            title={nextLevelInfo.label}
            lessonsRemaining={nextUnlock(completedLessonsCount, INVEST_DISCLOSURE_LEVELS, nextLevelInfo.level)}
          />
        )}

        <SimulationBadge compact />

        <button className="btn btn-primary" disabled={amount <= 0 || insufficientFunds} onClick={handleConfirm}>
          {insufficientFunds ? 'Insufficient balance' : 'Confirm investment'}
        </button>
      </div>
    </BottomSheet>
  );
}

function MiniRow({ label, value, warn }) {
  return (
    <div className={`invest-mini-row${warn ? ' invest-mini-row--warn' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
