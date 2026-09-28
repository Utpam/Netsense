import { Laptop, Pause, Play, Info } from 'lucide-react'
import StatusBadge from '../common/StatusBadge.jsx'

/**
 * DeviceCard
 * Mobile-friendly card representation of a single connected hotspot device.
 * Used on small screens (<640px) to provide a clean, non-overflowing view.
 */
export default function DeviceCard({ device, onSelect, onToggleBlock }) {
  if (!device) return null

  const isBlocked = Boolean(device.blocked)
  const isOnline = device.online !== false

  return (
    <div
      className="card"
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: 4,
      }}
    >
      {/* Top Header: Device Name & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => onSelect && onSelect(device)}
          style={{
            padding: 0,
            textAlign: 'left',
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--color-primary)',
            minHeight: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Laptop size={15} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
          <span className="text-truncate" style={{ maxWidth: 190 }}>
            {device.deviceName || device.name || 'Unknown device'}
          </span>
        </button>

        <div>
          {isBlocked ? (
            <StatusBadge status="blocked" label="Paused" />
          ) : (
            <span
              className={`badge ${isOnline ? 'badge-success' : 'badge-neutral'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: isOnline ? 'var(--color-success)' : 'var(--color-text-muted)',
                }}
              />
              {isOnline ? 'Connected' : 'Offline'}
            </span>
          )}
        </div>
      </div>

      {/* Network Specs: IP and MAC Address */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '8px 10px',
          background: 'var(--color-surface-subtle)',
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>IP</span>
          <span className="mono" style={{ fontWeight: 500, color: 'var(--color-text)' }}>
            {device.ipAddress || device.ip || 'Unknown IP'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>MAC</span>
          <span
            className="mono"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 11,
              wordBreak: 'break-all',
              textAlign: 'right',
            }}
          >
            {device.macAddress || device.mac || '—'}
          </span>
        </div>
      </div>

      {/* Action Buttons: Details and Pause/Resume */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', paddingTop: 2 }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onSelect && onSelect(device)}
          style={{ flex: 1, minHeight: 34, fontSize: 12 }}
        >
          <Info size={13} />
          Details
        </button>

        {onToggleBlock && (
          <button
            type="button"
            className={`btn ${isBlocked ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => onToggleBlock(device.macAddress || device.mac)}
            style={{ flex: 1, minHeight: 34, fontSize: 12 }}
            title={isBlocked ? 'Resume internet access' : 'Pause internet access'}
          >
            {isBlocked ? <Play size={12} /> : <Pause size={12} />}
            {isBlocked ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  )
}
