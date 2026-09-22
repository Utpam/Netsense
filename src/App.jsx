import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'

// Level 1: Normal User Navigation
import DashboardPage from './pages/DashboardPage.jsx'
import DevicesPage from './pages/DevicesPage.jsx'
import FilesPage from './pages/FilesPage.jsx'
import LocalServicesPage from './pages/LocalServicesPage.jsx'
import HelpPage from './pages/HelpPage.jsx'

// Level 2 & 3: Advanced Settings & Technical Configuration
import AdvancedSettingsPage from './pages/advanced/AdvancedSettingsPage.jsx'
import NetworkSection from './pages/advanced/NetworkSection.jsx'
import CellularSection from './pages/advanced/CellularSection.jsx'
import QosSection from './pages/advanced/QosSection.jsx'
import DnsSection from './pages/advanced/DnsSection.jsx'
import VpnSection from './pages/advanced/VpnSection.jsx'
import TrafficSection from './pages/advanced/TrafficSection.jsx'
import SecuritySection from './pages/advanced/SecuritySection.jsx'
import MonitoringSection from './pages/advanced/MonitoringSection.jsx'
import PowerSection from './pages/advanced/PowerSection.jsx'
import SystemSection from './pages/advanced/SystemSection.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Level 1: Normal User Pages */}
          <Route index element={<DashboardPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="services" element={<LocalServicesPage />} />
          <Route path="help" element={<HelpPage />} />

          {/* Level 2 & 3: Advanced Settings */}
          <Route path="advanced" element={<AdvancedSettingsPage />}>
            <Route index element={<Navigate to="network" replace />} />
            <Route path="network" element={<NetworkSection />} />
            <Route path="cellular" element={<CellularSection />} />
            <Route path="qos" element={<QosSection />} />
            <Route path="dns" element={<DnsSection />} />
            <Route path="vpn" element={<VpnSection />} />
            <Route path="traffic" element={<TrafficSection />} />
            <Route path="security" element={<SecuritySection />} />
            <Route path="monitoring" element={<MonitoringSection />} />
            <Route path="power" element={<PowerSection />} />
            <Route path="system" element={<SystemSection />} />
          </Route>

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
