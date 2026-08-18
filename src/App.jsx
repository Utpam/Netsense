import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Auth
import LoginPage from './pages/LoginPage.jsx'
import useAuthStore from './store/useAuthStore.js'

// Layouts
import AdminLayout  from './pages/admin/AdminLayout.jsx'
import ClientLayout from './pages/client/ClientLayout.jsx'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminNetwork   from './pages/admin/AdminNetwork.jsx'
import AdminGateway   from './pages/admin/AdminGateway.jsx'
import AdminDevices   from './pages/admin/AdminDevices.jsx'
import AdminTraffic   from './pages/admin/AdminTraffic.jsx'
import AdminQoS       from './pages/admin/AdminQoS.jsx'
import AdminDns       from './pages/admin/AdminDns.jsx'
import AdminVpn       from './pages/admin/AdminVpn.jsx'
import AdminFiles     from './pages/admin/AdminFiles.jsx'
import AdminSettings  from './pages/admin/AdminSettings.jsx'

// Client pages
import ClientDashboard   from './pages/client/ClientDashboard.jsx'
import ClientSignal      from './pages/client/ClientSignal.jsx'
import ClientUsage       from './pages/client/ClientUsage.jsx'
import ClientDevices     from './pages/client/ClientDevices.jsx'
import ClientServices    from './pages/client/ClientServices.jsx'
import ClientTroubleshoot from './pages/client/ClientTroubleshoot.jsx'

// Protected route wrapper
function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → Client */}
        <Route path="/" element={<Navigate to="/client" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Client Portal (no auth required) */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="signal"   element={<ClientSignal />} />
          <Route path="usage"    element={<ClientUsage />} />
          <Route path="devices"  element={<ClientDevices />} />
          <Route path="services" element={<ClientServices />} />
          <Route path="help"     element={<ClientTroubleshoot />} />
        </Route>

        {/* Admin Portal (JWT required) */}
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index          element={<AdminDashboard />} />
          <Route path="network" element={<AdminNetwork />} />
          <Route path="gateway" element={<AdminGateway />} />
          <Route path="devices" element={<AdminDevices />} />
          <Route path="traffic" element={<AdminTraffic />} />
          <Route path="qos"     element={<AdminQoS />} />
          <Route path="dns"     element={<AdminDns />} />
          <Route path="vpn"     element={<AdminVpn />} />
          <Route path="files"   element={<AdminFiles />} />
          <Route path="settings"element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
