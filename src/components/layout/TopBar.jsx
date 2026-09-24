import { Menu } from 'lucide-react'
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
      {/* Hamburger — visible only on mobile, opens drawer */}
      <button
        className="btn btn-ghost btn-sm mobile-menu-btn"
        style={{ padding: '4px 6px', flexShrink: 0 }}
        onClick={onOpenMobile}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Network summary — truncates on narrow screens */}
      <div className="topbar-network-info">
        <span className="live-dot" />
        <span
          className="text-truncate"
          style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 12 }}
        >
          {signal.operator || 'Cellular'}&nbsp;({signal.technology || '4G LTE'})
        </span>
        <span className="topbar-hide-mobile" style={{ color: 'var(--color-border)' }}>|</span>
        <span className="topbar-hide-mobile text-truncate" style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>
          Signal:&nbsp;<strong style={{ color: 'var(--color-text)' }}>{sigQuality.label}</strong>
        </span>
      </div>

      {/* Right-side stats — hide verbose items on mobile */}
      <div className="topbar-right-info">
        <div className="topbar-hide-mobile" style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--color-text-secondary)' }}>
          <span>↓&nbsp;<strong className="mono" style={{ color: 'var(--color-primary)' }}>{formatRate(traffic.rxRate)}</strong></span>
          <span>↑&nbsp;<strong className="mono">{formatRate(traffic.txRate)}</strong></span>
        </div>
        <span className="topbar-hide-mobile" style={{ color: 'var(--color-border)', fontSize: 11 }}>|</span>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'flex', gap: 5, alignItems: 'center' }}>
          <span className="mono text-truncate" style={{ maxWidth: '100px' }}>{system.lanIp || '192.168.1.1'}</span>
          <span className="topbar-hide-mobile">CPU&nbsp;<strong className="mono" style={{ color: 'var(--color-text)' }}>{system.cpu}%</strong></span>
        </div>
      </div>
    </header>
  )
}
