// MetricCard — Compact information block for NetSense router panel

export default function MetricCard({ label, value, unit, icon: Icon, subtext, accentColor, children, className = '' }) {
  return (
    <div className={`info-block ${className}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="info-block-label">{label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="info-block-value mono" style={accentColor ? { color: accentColor } : {}}>
              {value ?? '—'}
            </span>
            {unit && <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{unit}</span>}
          </div>
          {subtext && (
            <div className="info-block-sub">{subtext}</div>
          )}
          {children}
        </div>
        {Icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 3,
            background: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--color-primary)'
          }}>
            <Icon size={15} />
          </div>
        )}
      </div>
    </div>
  )
}
