// MetricCard — shows a large value + label + optional trend indicator
export default function MetricCard({ label, value, unit, icon: Icon, trend, trendLabel, accentColor, children }) {
  const trendUp    = trend > 0
  const trendDown  = trend < 0
  const trendColor = trendUp ? 'var(--color-success)' : trendDown ? 'var(--color-danger)' : 'var(--color-text-muted)'

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="metric-label">{label}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="metric-value mono" style={accentColor ? { color: accentColor } : {}}>
              {value ?? '—'}
            </span>
            {unit && <span className="metric-unit">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div style={{ marginTop: 6, fontSize: 11, color: trendColor, display: 'flex', alignItems: 'center', gap: 3 }}>
              {trendUp ? '▲' : trendDown ? '▼' : '─'}
              {trendLabel && <span style={{ color: 'var(--color-text-muted)' }}>{trendLabel}</span>}
            </div>
          )}
          {children}
        </div>
        {Icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--color-surface-4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={18} color="var(--color-text-muted)" />
          </div>
        )}
      </div>
    </div>
  )
}
