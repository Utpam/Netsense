import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Laptop,
  FolderOpen,
  Server,
  Settings,
  HelpCircle,
  Radio,
  X
} from 'lucide-react'
import TopBar from './TopBar.jsx'
import useSignalStore from '../../store/useSignalStore.js'
import useTrafficStore from '../../store/useTrafficStore.js'
import useSystemStore from '../../store/useSystemStore.js'
import { usePolling } from '../../hooks/usePolling.js'
import { POLL_SIGNAL, POLL_TRAFFIC, POLL_SYSTEM } from '../../lib/constants.js'
import { signalQuality } from '../../lib/utils.js'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const signal   = useSignalStore(s => s.current)
  const fetchSig = useSignalStore(s => s.fetch)
  const tickTraf = useTrafficStore(s => s.tick)
  const fetchSys = useSystemStore(s => s.fetch)

  usePolling(fetchSig, POLL_SIGNAL)
  usePolling(tickTraf, POLL_TRAFFIC)
  usePolling(fetchSys, POLL_SYSTEM)

  const sigQuality = signalQuality(signal.rssi)
  const isAdvanced = location.pathname.startsWith('/advanced')

  const closeSidebar = () => setMobileOpen(false)

  return (
    <div className="app-container">
      {/* Mobile backdrop — tap to close sidebar */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
        {/* Brand + close button */}
        <div className="sidebar-brand">
          <div style={{
            width: 24, height: 24, borderRadius: 3,
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', flexShrink: 0
          }}>
            <Radio size={14} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="sidebar-brand-title">NETSENSE</div>
          </div>
          {/* Close button — only shown when sidebar is a drawer (mobile) */}
          <button
            className="btn btn-ghost btn-sm sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            style={{ padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav" aria-label="Site navigation">
          <NavLink
            to="/"
            end
            onClick={closeSidebar}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} style={{ flexShrink: 0 }} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/devices"
            onClick={closeSidebar}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Laptop size={16} style={{ flexShrink: 0 }} />
            <span>Devices</span>
          </NavLink>

          <NavLink
            to="/files"
            onClick={closeSidebar}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <FolderOpen size={16} style={{ flexShrink: 0 }} />
            <span>Files</span>
          </NavLink>

          <NavLink
            to="/services"
            onClick={closeSidebar}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Server size={16} style={{ flexShrink: 0 }} />
            <span>Local Services</span>
          </NavLink>

          <div className="sidebar-divider" />

          {/* Advanced Settings uses pathname match since it has sub-routes */}
          <NavLink
            to="/advanced"
            onClick={closeSidebar}
            className={`sidebar-nav-item ${isAdvanced ? 'active' : ''}`}
          >
            <Settings size={16} style={{ flexShrink: 0 }} />
            <span>Advanced Settings</span>
          </NavLink>

          <div className="sidebar-divider" />

          <NavLink
            to="/help"
            onClick={closeSidebar}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <HelpCircle size={16} style={{ flexShrink: 0 }} />
            <span>Help</span>
          </NavLink>
        </nav>

        {/* Status footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
            <span className="badge badge-success">
              <span className="badge-dot" />
              Connected
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span>Network</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{signal.technology || '4G LTE'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, color: 'var(--color-text-muted)' }}>
            <span>Signal</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{sigQuality.label}</span>
          </div>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────────── */}
      <div className="app-main">
        <TopBar onOpenMobile={() => setMobileOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
