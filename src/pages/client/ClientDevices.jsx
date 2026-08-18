import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import useDeviceStore from '../../store/useDeviceStore.js'
import { formatBytes, timeAgo } from '../../lib/utils.js'
import { Laptop, Smartphone, Tv, Monitor, Server, HelpCircle } from 'lucide-react'

const deviceIcon = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('iphone') || n.includes('phone')) return Smartphone
  if (n.includes('tv'))     return Tv
  if (n.includes('nas') || n.includes('server')) return Server
  if (n.includes('mac') || n.includes('laptop')) return Laptop
  return Monitor
}

export default function ClientDevices() {
  const devices = useDeviceStore(s => s.devices)
  const online  = devices.filter(d => d.online && !d.blocked)

  return (
    <div>
      <PageHeader
        title="Connected Devices"
        subtitle={`${online.length} device${online.length !== 1 ? 's' : ''} currently online`}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {devices.map(d => {
          const Icon = deviceIcon(d.name)
          return (
            <div key={d.mac} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: d.online ? 'var(--color-primary-dim)' : 'var(--color-surface-4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={d.online ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {d.name}
                  <StatusBadge status={d.blocked ? 'blocked' : d.online ? 'online' : 'offline'} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }} className="mono">
                  {d.ip} · {d.mac.toUpperCase()}
                </div>
              </div>
              <div style={{ fontSize: 12, textAlign: 'right' }}>
                <div style={{ color: 'var(--color-primary)' }} className="mono">↓ {formatBytes(d.rx)}</div>
                <div style={{ color: 'var(--color-info)'    }} className="mono">↑ {formatBytes(d.tx)}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 2 }}>{timeAgo(d.lastSeen)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
