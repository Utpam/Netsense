import { useState, useMemo } from 'react'
import { Laptop, Search, Pause, Play, AlertCircle, RefreshCw } from 'lucide-react'
import DeviceCard from './DeviceCard.jsx'
import StatusBadge from '../common/StatusBadge.jsx'

export default function ConnectedDevices({
  devices = [],
  loading = false,
  error = null,
  onRetry,
  onSelectDevice,
  onToggleBlock,
}) {
  const [query, setQuery] = useState('')

  // Filter devices by query
  const filtered = useMemo(() => {
    if (!query) return devices
    const q = query.toLowerCase().trim()
    return devices.filter(d => {
      const name = String(d.deviceName || d.name || '').toLowerCase()
      const ip = String(d.ipAddress || d.ip || '').toLowerCase()
      const mac = String(d.macAddress || d.mac || '').toLowerCase()
      return name.includes(q) || ip.includes(q) || mac.includes(q)
    })
  }, [devices, query])

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Laptop size={15} color="var(--color-primary)" />
          <span className="card-title">Connected Devices</span>
        </div>
        <span className="badge badge-info">
          {devices.length} {devices.length === 1 ? 'Client' : 'Clients'}
        </span>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search
            size={13}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              zIndex: 1,
            }}
          />
          <input
            className="form-input"
            style={{ width: '100%', paddingLeft: 28, fontSize: 12, minHeight: 34 }}
            placeholder="Search device name, IP, or MAC…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Error State ── */}
      {error && devices.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)', marginBottom: 8 }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Unable to load connected devices.</span>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {error}
          </p>
          {onRetry && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onRetry}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={12} />
              Retry
            </button>
          )}
        </div>
      ) : loading && devices.length === 0 ? (
        /* ── Loading Skeleton ── */
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                height: 38,
                background: 'var(--color-border-subtle)',
                borderRadius: 4,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* ── Empty State ── */
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
            {query ? 'No matching devices found' : 'No devices connected'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', maxWidth: 360, margin: '0 auto' }}>
            {query
              ? `No connected devices matched "${query}". Clear your search query to see all clients.`
              : 'No devices are currently connected to the hotspot.'}
          </div>
        </div>
      ) : (
        /* ── Device Views: Desktop Table & Mobile Cards ── */
        <>
          {/* Desktop / Tablet Table View */}
          <div className="device-desktop-table">
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="router-table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>IP Address</th>
                    <th>MAC Address</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((device, idx) => {
                    const devName = device.deviceName || device.name || 'Unknown device'
                    const devIp   = device.ipAddress || device.ip || 'Unknown IP'
                    const devMac  = device.macAddress || device.mac || '—'
                    const isBlocked = Boolean(device.blocked)
                    const isOnline  = device.online !== false

                    return (
                      <tr key={devMac !== '—' ? devMac : idx}>
                        {/* Device Name */}
                        <td>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{
                              padding: 0,
                              textAlign: 'left',
                              color: 'var(--color-primary)',
                              fontWeight: 600,
                              minHeight: 'auto',
                            }}
                            onClick={() => onSelectDevice && onSelectDevice(device)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <Laptop size={14} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
                              <div>
                                <div className="text-truncate" style={{ maxWidth: 180 }}>{devName}</div>
                                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 400 }}>
                                  {device.vendor || 'Wi-Fi Client'}
                                </div>
                              </div>
                            </div>
                          </button>
                        </td>

                        {/* IP Address */}
                        <td className="mono" style={{ fontSize: 12 }}>
                          {devIp}
                        </td>

                        {/* MAC Address (not visually dominant) */}
                        <td
                          className="mono"
                          style={{
                            fontSize: 11,
                            color: 'var(--color-text-secondary)',
                            wordBreak: 'break-all',
                          }}
                        >
                          {devMac}
                        </td>

                        {/* Status */}
                        <td>
                          {isBlocked ? (
                            <StatusBadge status="blocked" label="Paused" />
                          ) : (
                            <span
                              className={`badge ${isOnline ? 'badge-success' : 'badge-neutral'}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: isOnline ? 'var(--color-success)' : 'var(--color-text-muted)',
                                }}
                              />
                              {isOnline ? 'Connected' : 'Offline'}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => onSelectDevice && onSelectDevice(device)}
                            >
                              Details
                            </button>
                            {onToggleBlock && (
                              <button
                                type="button"
                                className={`btn ${isBlocked ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                onClick={() => onToggleBlock(devMac)}
                                title={isBlocked ? 'Resume internet access' : 'Pause internet access'}
                              >
                                {isBlocked ? <Play size={11} /> : <Pause size={11} />}
                                {isBlocked ? 'Resume' : 'Pause'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="device-mobile-cards">
            {filtered.map((device, idx) => (
              <DeviceCard
                key={device.macAddress || device.mac || idx}
                device={device}
                onSelect={onSelectDevice}
                onToggleBlock={onToggleBlock}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
