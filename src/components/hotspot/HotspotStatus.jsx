import { Radio, AlertCircle, RefreshCw } from 'lucide-react'

export default function HotspotStatus({ status, loading, error, onRetry }) {
  // 1. Error state
  if (error && !status) {
    return (
      <div className="card" style={{ flex: 1, minWidth: 240 }}>
        <div className="card-header">
          <span className="card-title">Hotspot</span>
          <span className="badge badge-danger">Unavailable</span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Unable to fetch hotspot status.</span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {error}
          </p>
          {onRetry && (
            <div style={{ marginTop: 4 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onRetry}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 2. Loading skeleton state (when no status yet)
  if (loading && !status) {
    return (
      <div className="card" style={{ flex: 1, minWidth: 240 }}>
        <div className="card-header">
          <span className="card-title">Hotspot</span>
          <span className="badge badge-neutral">Loading…</span>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ height: 24, width: 90, background: 'var(--color-border-subtle)', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 14, width: 150, background: 'var(--color-border-subtle)', borderRadius: 4 }} />
        </div>
      </div>
    )
  }

  const isActive = Boolean(status?.active)

  return (
    <div className="card" style={{ flex: 1, minWidth: 240 }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio size={14} color={isActive ? 'var(--color-success)' : 'var(--color-text-secondary)'} />
          <span className="card-title">Hotspot</span>
        </div>
        <span
          className={`badge ${isActive ? 'badge-success' : 'badge-neutral'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isActive ? 'var(--color-success)' : 'var(--color-text-muted)',
              display: 'inline-block',
            }}
          />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="card-body" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: isActive ? 'var(--color-success)' : 'var(--color-text)',
            }}
          >
            ● {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {isActive ? 'Hotspot is currently running' : 'Hotspot is currently off'}
        </div>
      </div>
    </div>
  )
}
