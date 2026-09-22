import { Outlet } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import AdvancedNav from '../../components/advanced/AdvancedNav.jsx'

export default function AdvancedSettingsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Advanced Settings"
        subtitle="Low-level router configuration, network daemons, cellular RF, and security parameters"
      />

      <AdvancedNav />

      <div>
        <Outlet />
      </div>
    </div>
  )
}
