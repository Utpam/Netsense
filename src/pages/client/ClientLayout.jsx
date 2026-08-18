import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Radio, BarChart3, Laptop,
  Server, HelpCircle,
} from 'lucide-react'
import useSignalStore from '../../store/useSignalStore.js'
import useTrafficStore from '../../store/useTrafficStore.js'
import { formatRate, signalQuality } from '../../lib/utils.js'
import { usePolling } from '../../hooks/usePolling.js'
import { POLL_SIGNAL, POLL_TRAFFIC } from '../../lib/constants.js'

const NAV = [
  { section: 'Status' },
  { to: '/client',           label: 'Overview',     icon: LayoutDashboard, end: true },
  { section: 'Connection' },
  { to: '/client/signal',    label: 'Signal',        icon: Radio },
  { to: '/client/usage',     label: 'Data Usage',    icon: BarChart3 },
  { section: 'Network' },
  { to: '/client/devices',   label: 'Devices',       icon: Laptop },
  { to: '/client/services',  label: 'Local Services',icon: Server },
  { section: 'Help' },
  { to: '/client/help',      label: 'Troubleshoot',  icon: HelpCircle },
]

export default function ClientLayout() {
  const signal   = useSignalStore(s => s.current)
  const fetchSig = useSignalStore(s => s.fetch)
  const traffic  = useTrafficStore(s => s.live)
  const tickTraf = useTrafficStore(s => s.tick)

  usePolling(fetchSig, POLL_SIGNAL)
  usePolling(tickTraf, POLL_TRAFFIC)

  const q = signalQuality(signal.rssi)

  return (
    <div className="layout-root">
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={16} color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', lineHeight: 1 }}>SkyLink</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>GATEWAY</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} className="nav-section-label">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <item.icon size={15} />
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Live status */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)', fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Connection</span>
            <span className={`badge badge-success`} style={{ fontSize: 10 }}>Connected</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Signal</span>
            <span className={`mono ${q.color}`}>{signal.rssi} dBm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>↓ DL</span>
            <span className="mono text-primary">{formatRate(traffic.rxRate)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>↑ UL</span>
            <span className="mono text-info">{formatRate(traffic.txRate)}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="layout-main">
        <div className="layout-topbar">
          <span className="live-dot" />
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {signal.operator} · {signal.technology} · Band {signal.band}
          </span>
          <div style={{ flex: 1 }} />
          <a
            href="/login"
            style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            Admin →
          </a>
        </div>
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
