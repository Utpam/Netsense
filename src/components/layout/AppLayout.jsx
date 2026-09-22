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

  // Polling stores for real-time status
  const signal   = useSignalStore(s => s.current)
  const fetchSig = useSignalStore(s => s.fetch)
  const tickTraf = useTrafficStore(s => s.tick)
  const fetchSys = useSystemStore(s => s.fetch)

  usePolling(fetchSig, POLL_SIGNAL)
  usePolling(tickTraf, POLL_TRAFFIC)
  usePolling(fetchSys, POLL_SYSTEM)

  const sigQuality = signalQuality(signal.rssi)
  const isAdvanced = location.pathname.startsWith('/advanced')

  return (
    <div className="app-container">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Compact Left Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div style={{
            width: 24, height: 24, borderRadius: 3,
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Radio size={14} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="sidebar-brand-title">NETSENSE</div>
          </div>
          <button
            className="btn btn-ghost btn-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            style={{ padding: 2 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/devices"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Laptop size={16} />
            <span>Devices</span>
          </NavLink>

          <NavLink
            to="/files"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <FolderOpen size={16} />
            <span>Files</span>
          </NavLink>

          <NavLink
            to="/services"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Server size={16} />
            <span>Local Services</span>
          </NavLink>

          <div className="sidebar-divider" />

          <NavLink
            to="/advanced"
            onClick={() => setMobileOpen(false)}
            className={`sidebar-nav-item ${isAdvanced ? 'active' : ''}`}
          >
            <Settings size={16} />
            <span>Advanced Settings</span>
          </NavLink>

          <div className="sidebar-divider" />

          <NavLink
            to="/help"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer - Status Summary */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
            <span className="badge badge-success" style={{ fontSize: 10, padding: '1px 5px' }}>
              <span className="badge-dot" />
              Connected
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <span>Network</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{signal.technology || '4G LTE'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2, color: 'var(--color-text-muted)' }}>
            <span>Signal</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{sigQuality.label}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main">
        <TopBar onOpenMobile={() => setMobileOpen(true)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
