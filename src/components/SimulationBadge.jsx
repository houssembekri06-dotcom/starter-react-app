export default function SimulationBadge({ compact = false }) {
  return (
    <div className={compact ? 'sim-badge sim-badge--compact' : 'sim-badge'}>
      Simulation · virtual money, no real-world impact
    </div>
  );
}
