import { useState } from 'react'
import { X, Laptop, Wifi, ShieldAlert, ArrowRight, Save, Play, Pause } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import { formatBytes } from '../../lib/utils.js'
import { Link } from 'react-router-dom'

export default function DeviceDetailModal({ device, onClose, onUpdateDevice, onToggleBlock }) {
  const [name, setName] = useState(device?.name || '')
  const [saved, setSaved] = useState(false)

  if (!device) return null

  const handleSaveName = (e) => {
    e.preventDefault()
    if (onUpdateDevice && name.trim()) {
      onUpdateDevice(device.mac, { name: name.trim() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const isBlocked = device.blocked

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Laptop size={16} color="var(--color-primary)" />
            <span className="modal-title">Device Information</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick status row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', background: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border-subtle)', borderRadius: 4
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{device.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{device.vendor || 'Unknown Vendor'}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {isBlocked ? (
                <StatusBadge status="blocked" label="Paused" />
              ) : (
                <StatusBadge status={device.online ? 'connected' : 'offline'} />
              )}
            </div>
          </div>

          {/* Rename form */}
          <form onSubmit={handleSaveName} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label className="form-label">Friendly Device Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Living Room TV"
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" style={{ height: 32 }}>
              <Save size={13} />
              {saved ? 'Saved!' : 'Rename'}
            </button>
          </form>

          {/* Detailed attributes table */}
          <div>
            <div className="form-label" style={{ marginBottom: 6 }}>Network Parameters</div>
            <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
              {[
                ['IP Address', device.ip, true],
                ['MAC Address', device.mac, true],
                ['Hostname', device.hostname || '—', true],
                ['Connection', 'Wi-Fi 5GHz (wlan0)', false],
                ['Data Downloaded', formatBytes(device.rx || 0), true],
                ['Data Uploaded', formatBytes(device.tx || 0), true],
                ['Total Usage', formatBytes((device.rx || 0) + (device.tx || 0)), true],
              ].map(([k, v, isMono], idx) => (
                <div
                  key={k}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 10px',
                    fontSize: 12,
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                    borderBottom: idx === 6 ? 'none' : '1px solid var(--color-border-subtle)'
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
                  <span className={isMono ? 'mono' : ''} style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
            <button
              className={`btn ${isBlocked ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => onToggleBlock(device.mac)}
            >
              {isBlocked ? (
                <>
                  <Play size={13} />
                  Resume Internet Access
                </>
              ) : (
                <>
                  <Pause size={13} />
                  Pause Internet Access
                </>
              )}
            </button>

            <Link
              to="/advanced/qos"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-primary)' }}
            >
              Set QoS Bandwidth Limit
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
