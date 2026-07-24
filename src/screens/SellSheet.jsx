import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import SimulationBadge from '../components/SimulationBadge';
import { formatEUR, formatShares } from '../utils/format';

const FRACTIONS = [
  { label: '25 %', value: 0.25 },
  { label: '50 %', value: 0.5 },
  { label: '100 %', value: 1 },
];

export default function SellSheet({ asset, position, feeRate, onClose, onConfirm }) {
  const [fraction, setFraction] = useState(0.25);
  const shares = position.shares * fraction;
  const proceeds = shares * asset.price;
  const fees = proceeds * feeRate;

  return (
    <BottomSheet open onClose={onClose} title={`Vendre ${asset.symbol}`}>
      <div className="invest-sheet">
        <div className="invest-section">
          <label className="invest-label">Quantité à vendre</label>
          <div className="invest-amount-display">{formatShares(shares)} parts</div>
          <div className="quick-amounts-row">
            {FRACTIONS.map((f) => (
              <button
                key={f.label}
                className={`quick-amount-btn${fraction === f.value ? ' quick-amount-btn--active' : ''}`}
                onClick={() => setFraction(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="invest-mini-rows">
          <div className="invest-mini-row"><span>Valeur estimée</span><strong>{formatEUR(proceeds)}</strong></div>
          <div className="invest-mini-row"><span>Frais de transaction</span><strong>{formatEUR(fees)}</strong></div>
          <div className="invest-mini-row"><span>Montant net reçu</span><strong>{formatEUR(proceeds - fees)}</strong></div>
        </div>

        <SimulationBadge compact />

        <button className="btn btn-rose-outline" onClick={() => onConfirm(shares)}>
          Confirmer la vente
        </button>
      </div>
    </BottomSheet>
  );
}
