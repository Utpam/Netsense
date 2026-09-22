import { NavLink } from 'react-router-dom'
import {
  Network,
  Radio,
  Sliders,
  Database,
  Shield,
  Activity,
  Lock,
  LineChart,
  BatteryCharging,
  Cpu
} from 'lucide-react'

const SECTIONS = [
  { id: 'network',    label: 'Network',     icon: Network,         path: '/advanced/network' },
  { id: 'cellular',   label: 'Cellular',    icon: Radio,           path: '/advanced/cellular' },
  { id: 'qos',        label: 'QoS',         icon: Sliders,         path: '/advanced/qos' },
  { id: 'dns',        label: 'DNS',         icon: Database,        path: '/advanced/dns' },
  { id: 'vpn',        label: 'VPN',         icon: Shield,          path: '/advanced/vpn' },
  { id: 'traffic',    label: 'Traffic',     icon: Activity,        path: '/advanced/traffic' },
  { id: 'security',   label: 'Security',    icon: Lock,            path: '/advanced/security' },
  { id: 'monitoring', label: 'Monitoring',  icon: LineChart,       path: '/advanced/monitoring' },
  { id: 'power',      label: 'Power',       icon: BatteryCharging, path: '/advanced/power' },
  { id: 'system',     label: 'System',      icon: Cpu,             path: '/advanced/system' },
]

export default function AdvancedNav() {
  return (
    <div className="advanced-tabs">
      {SECTIONS.map((sec) => (
        <NavLink
          key={sec.id}
          to={sec.path}
          className={({ isActive }) => `advanced-tab-item ${isActive ? 'active' : ''}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <sec.icon size={13} />
          <span>{sec.label}</span>
        </NavLink>
      ))}
    </div>
  )
}
