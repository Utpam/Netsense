import { Menu, ShieldCheck, Activity, Wifi, Radio } from 'lucide-react'
import useSignalStore from '../../store/useSignalStore.js'
import useSystemStore from '../../store/useSystemStore.js'
import useTrafficStore from '../../store/useTrafficStore.js'
import { formatRate, signalQuality } from '../../lib/utils.js'

export default function TopBar({ onOpenMobile }) {
  const signal  = useSignalStore(s => s.current)
  const system  = useSystemStore(s => s.status)
  const traffic = useTrafficStore(s => s.live)

  const sigQuality = signalQuality(signal.rssi)

  return (
    <header className="app-header">
      {/* Mobile toggle button */}
      <button
        className="btn btn-ghost btn-sm md:hidden"
        style={{ padding: '4px 6px', marginRight: 8 }}
        onClick={onOpenMobile}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Network summary ticker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot" />
          <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
            {signal.operator || 'Cellular'} ({signal.technology || '4G LTE'})
          </span>
        </div>

        <span style={{ color: 'var(--color-border)' }}>|</span>

        <span style={{ color: 'var(--color-text-secondary)' }}>
          Signal: <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{sigQuality.label}</strong>
        </span>
      </div>

      {/* Right side status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--color-text-secondary)' }}>
          <div>
            ↓ <span className="mono" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{formatRate(traffic.rxRate)}</span>
          </div>
          <div>
            ↑ <span className="mono" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{formatRate(traffic.txRate)}</span>
          </div>
        </div>

        <span className="hidden sm:inline" style={{ color: 'var(--color-border)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-text-secondary)' }}>
          <span className="mono">{system.lanIp || '192.168.1.1'}</span>
          <span>(CPU <strong className="mono" style={{ color: 'var(--color-text)' }}>{system.cpu}%</strong>)</span>
        </div>
      </div>
    </header>
  )
}
