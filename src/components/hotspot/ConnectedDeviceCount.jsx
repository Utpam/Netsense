import { Laptop } from 'lucide-react'

export default function ConnectedDeviceCount({ count, loading, error, onRetry }) {
  // 1. Loading skeleton state
  if (loading && count === undefined && !error) {
    return (
      <div className="card" style={{ flex: 1, minWidth: 240 }}>
        <div className="card-header">
          <span className="card-title">Connected Devices</span>
          <span className="badge badge-neutral">Loading…</span>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ height: 28, width: 48, background: 'var(--color-border-subtle)', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 14, width: 120, background: 'var(--color-border-subtle)', borderRadius: 4 }} />
        </div>
      </div>
    )
  }

  // 2. Error state
  if (error && count === undefined) {
    return (
      <div className="card" style={{ flex: 1, minWidth: 240 }}>
        <div className="card-header">
          <span className="card-title">Connected Devices</span>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-muted)' }}>—</div>
          <div style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 4 }}>
            Unable to load device count
          </div>
          {onRetry && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onRetry}
              style={{ marginTop: 6, padding: 0, fontSize: 11, color: 'var(--color-primary)' }}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  const displayCount = typeof count === 'number' ? count : 0

  return (
    <div className="card" style={{ flex: 1, minWidth: 240 }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Laptop size={14} color="var(--color-primary)" />
          <span className="card-title">Connected Devices</span>
        </div>
        <span className="badge badge-info">
          {displayCount} {displayCount === 1 ? 'Device' : 'Devices'}
        </span>
      </div>
      <div className="card-body" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>
            {displayCount}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {displayCount === 1 ? '1 device currently connected' : `${displayCount} devices connected`}
        </div>
      </div>
    </div>
  )
}
