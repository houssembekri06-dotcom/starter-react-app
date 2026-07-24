export default function SimulationBadge({ compact = false }) {
  return (
    <div className={compact ? 'sim-badge sim-badge--compact' : 'sim-badge'}>
      Simulation · argent fictif, aucun impact réel
    </div>
  );
}
