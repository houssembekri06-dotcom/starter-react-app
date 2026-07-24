import './UnitEnvironmentBanner.css';

export default function UnitEnvironmentBanner({ env, unitTitle }) {
  return (
    <div
      className="env-banner"
      style={{ '--env-accent': env.accent, '--env-accent-soft': env.accentSoft }}
    >
      <img
        src={env.image}
        alt={env.place}
        className="env-banner-image"
        loading="lazy"
        width={1536}
        height={640}
      />
      <div className="env-banner-overlay" />
      <div className="env-banner-content">
        <span className="env-banner-chapter">{env.chapter}</span>
        <div className="env-banner-place">{env.place}</div>
        <div className="env-banner-tagline">{env.tagline}</div>
      </div>
    </div>
  );
}