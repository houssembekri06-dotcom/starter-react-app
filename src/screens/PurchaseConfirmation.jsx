import Icon from '../components/Icon';
import SimulationBadge from '../components/SimulationBadge';
import { formatEUR, formatShares } from '../utils/format';
import './PurchaseConfirmation.css';

export default function PurchaseConfirmation({ asset, result, lessonBadge, onBack }) {
  return (
    <div className="screen confirmation-screen">
      <div className="confirmation-icon">
        <Icon name="circle-check" size={56} stroke={1.3} color="var(--color-teal)" />
      </div>

      <h1 className="confirmation-title">Purchase confirmed</h1>
      <p className="confirmation-sub">
        You just invested in {asset.name} ({asset.symbol}).
      </p>

      {lessonBadge && (
        <div className="confirmation-xp-badge">
          <Icon name="sparkles" size={16} stroke={2.2} color="var(--color-coral-text)" />
          +{lessonBadge.xp} XP · Lesson completed: {lessonBadge.title}
        </div>
      )}

      <div className="confirmation-recap">
        <RecapRow label="Total shares held" value={`${formatShares(result.newTotalShares)} shares`} />
        <RecapRow label="Position value" value={formatEUR(result.newTotalShares * asset.price)} />
        <RecapRow label="New average price" value={formatEUR(result.newAvgPrice)} />
        <RecapRow label="Execution price" value={formatEUR(result.execPrice)} />
        <RecapRow label="Fees paid" value={formatEUR(result.fees)} />
      </div>

      <p className="confirmation-message">
        Nice work — you now know how to read an asset and place an order like on a real
        investment platform.
      </p>

      <SimulationBadge compact />

      <button className="btn btn-primary confirmation-cta" onClick={onBack}>
        Back to wallet
      </button>
    </div>
  );
}

function RecapRow({ label, value }) {
  return (
    <div className="recap-row">
      <span className="recap-label">{label}</span>
      <span className="recap-value">{value}</span>
    </div>
  );
}
