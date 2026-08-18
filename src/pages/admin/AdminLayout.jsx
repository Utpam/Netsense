import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Network, Globe, Sliders, Database,
  Shield, HardDrive, Laptop, Activity, Settings, LogOut, Radio,
  Menu, X
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore.js'
import useSignalStore from '../../store/useSignalStore.js'
import useTrafficStore from '../../store/useTrafficStore.js'
import useSystemStore from '../../store/useSystemStore.js'
import { formatRate, formatUptime, signalQuality } from '../../lib/utils.js'
import { usePolling } from '../../hooks/usePolling.js'
import { POLL_SIGNAL, POLL_TRAFFIC, POLL_SYSTEM } from '../../lib/constants.js'

const NAV = [
  { section: 'Overview' },
  { to: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { section: 'Network' },
  { to: '/admin/network',  label: 'Interfaces', icon: Network },
  { to: '/admin/gateway',  label: 'Gateway',    icon: Globe },
  { section: 'Services' },
  { to: '/admin/qos',      label: 'QoS',        icon: Sliders },
  { to: '/admin/dns',      label: 'DNS',         icon: Database },
  { to: '/admin/vpn',      label: 'VPN',         icon: Shield },
  { to: '/admin/files',    label: 'File Server', icon: HardDrive },
  { section: 'Monitoring' },
  { to: '/admin/devices',  label: 'Devices',     icon: Laptop },
  { to: '/admin/traffic',  label: 'Traffic',     icon: Activity },
  { section: 'System' },
  { to: '/admin/settings', label: 'Settings',    icon: Settings },
]

export default function AdminLayout() {
  const logout      = useAuthStore(s => s.logout)
  const navigate    = useNavigate()
  const signal      = useSignalStore(s => s.current)
  const fetchSig    = useSignalStore(s => s.fetch)
  const traffic     = useTrafficStore(s => s.live)
  const tickTraf    = useTrafficStore(s => s.tick)
  const system      = useSystemStore(s => s.status)
  const fetchSys    = useSystemStore(s => s.fetch)

  const [mobileOpen, setMobileOpen] = useState(false)

  usePolling(fetchSig,   POLL_SIGNAL)
  usePolling(tickTraf,   POLL_TRAFFIC)
  usePolling(fetchSys,   POLL_SYSTEM)

  const q = signalQuality(signal.rssi)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="layout-root">
      {/* ── Mobile Overlay Backdrop ──────────────────────── */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`layout-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo & Mobile Close Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--color-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Radio size={16} color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)', lineHeight: 1 }}>SkyLink</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>ADMIN</div>
            </div>
          </div>

          {/* Close button inside mobile sidebar */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} className="nav-section-label">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <item.icon size={15} />
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Bottom status strip */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)', fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Signal</span>
            <span className={`mono ${q.color}`}>{signal.rssi} dBm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>↓ DL</span>
            <span className="mono" style={{ color: 'var(--color-primary)' }}>{formatRate(traffic.rxRate)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>↑ UL</span>
            <span className="mono" style={{ color: 'var(--color-info)' }}>{formatRate(traffic.txRate)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Uptime</span>
            <span className="mono" style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>{formatUptime(system.uptimeSeconds)}</span>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', gap: 6 }} onClick={handleLogout}>
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <main className="layout-main">
        {/* Top bar */}
        <div className="layout-topbar">
          {/* Hamburger button for mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {signal.operator} · {signal.technology}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span className="mono" style={{ display: 'inline-block' }}>{system.lanIp}</span>
            <span style={{ display: 'inline-block' }}>
              CPU <strong className="mono" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{system.cpu}%</strong>
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
