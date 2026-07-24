export function Card({ children, className = '', onClick, style }) {
  return (
    <div className={`card ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="section-title-row">
      <h3 className="section-title">{children}</h3>
      {action}
    </div>
  );
}
