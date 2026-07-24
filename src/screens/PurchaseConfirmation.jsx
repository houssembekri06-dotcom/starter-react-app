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

      <h1 className="confirmation-title">Achat confirmé</h1>
      <p className="confirmation-sub">
        Vous venez d'investir dans {asset.name} ({asset.symbol}).
      </p>

      {lessonBadge && (
        <div className="confirmation-xp-badge">
          <Icon name="sparkles" size={16} stroke={2.2} color="var(--color-coral-text)" />
          +{lessonBadge.xp} XP · Leçon terminée : {lessonBadge.title}
        </div>
      )}

      <div className="confirmation-recap">
        <RecapRow label="Parts détenues (total)" value={`${formatShares(result.newTotalShares)} parts`} />
        <RecapRow label="Valeur totale de la position" value={formatEUR(result.newTotalShares * asset.price)} />
        <RecapRow label="Nouveau prix moyen" value={formatEUR(result.newAvgPrice)} />
        <RecapRow label="Prix d'exécution" value={formatEUR(result.execPrice)} />
        <RecapRow label="Frais payés" value={formatEUR(result.fees)} />
      </div>

      <p className="confirmation-message">
        Bravo — vous savez maintenant lire un actif et passer un ordre comme sur une vraie
        plateforme d'investissement.
      </p>

      <SimulationBadge compact />

      <button className="btn btn-primary confirmation-cta" onClick={onBack}>
        Retour au portefeuille
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
