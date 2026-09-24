import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Server,
  HardDrive,
  Database,
  Sprout,
  Shield,
  Globe,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import useDnsStore from '../store/useDnsStore.js'
import useVpnStore from '../store/useVpnStore.js'

export default function LocalServicesPage() {
  const dnsStatus = useDnsStore(s => s.status)
  const vpnStatus = useVpnStore(s => s.status)

  const [selectedService, setSelectedService] = useState('files')

  const services = [
    {
      id: 'files',
      name: 'Local File Sharing',
      description: 'Shared storage for media, documents, and backups across the local network',
      status: 'running',
      icon: HardDrive,
      port: 'SMB (445) / HTTP (8080)',
      advancedPath: '/advanced/system',
      details: {
        summary: 'Samba / HTTP local share is running and accessible to all connected devices.',
        activeShares: '3 shares (/media, /documents, /backup)',
        clientsConnected: '2 active client sessions'
      }
    },
    {
      id: 'dns',
      name: 'DNS Cache Server',
      description: 'dnsmasq local caching DNS resolver for fast domain lookups and ad-blocking',
      status: dnsStatus.running ? 'running' : 'stopped',
      icon: Database,
      port: 'DNS (53 UDP/TCP)',
      advancedPath: '/advanced/dns',
      details: {
        summary: `DNS resolver is caching domain names with ${Math.round((dnsStatus.hitRate || 0.72) * 100)}% cache hit efficiency.`,
        upstream: '1.1.1.1, 8.8.8.8',
        queriesHandled: (dnsStatus.queriesTotal || 18453).toLocaleString()
      }
    },
    {
      id: 'farm',
      name: 'Offline Farm Hub',
      description: 'Local sensor data logging and agricultural monitoring agent for edge deployment',
      status: 'running',
      icon: Sprout,
      port: 'HTTP (8888)',
      advancedPath: '/advanced/monitoring',
      details: {
        summary: 'Collecting soil moisture, temperature, and ambient humidity from 4 field nodes.',
        storageLocation: '/srv/farm/telemetry.sqlite',
        lastSync: 'Syncing to local SQLite engine'
      }
    },
    {
      id: 'vpn',
      name: 'WireGuard VPN Tunnel',
      description: 'Encrypted site-to-site VPN link connecting to remote cloud gateway',
      status: vpnStatus.status === 'up' ? 'running' : 'disabled',
      icon: Shield,
      port: 'WireGuard (51820 UDP)',
      advancedPath: '/advanced/vpn',
      details: {
        summary: vpnStatus.status === 'up' ? 'WireGuard interface wg0 is active.' : 'WireGuard VPN tunnel is currently disabled.',
        peers: `${vpnStatus.peers || 2} configured peers`,
        ip: '10.0.0.1/24'
      }
    },
    {
      id: 'web',
      name: 'NetSense Router Web UI',
      description: 'Web administration portal for device configuration and status monitoring',
      status: 'running',
      icon: Globe,
      port: 'HTTP (80)',
      advancedPath: '/advanced/system',
      details: {
        summary: 'Web server hosting the NetSense administrative console.',
        firmware: 'NetSense OS 2.4.0-rpi',
        environment: 'Raspberry Pi Linux 6.6.31'
      }
    }
  ]

  const active = services.find(s => s.id === selectedService) || services[0]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Local Services"
        subtitle="Status of embedded daemons and network services running on NetSense"
      />

      <div className="services-split">
        {/* Service List */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Services</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>5 Daemons</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {services.map((svc, idx) => {
              const Icon = svc.icon
              const isSelected = svc.id === selectedService
              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: idx === services.length - 1 ? 'none' : '1px solid var(--color-border-subtle)',
                    backgroundColor: isSelected ? 'var(--color-primary-subtle)' : '#FFFFFF',
                    borderLeft: isSelected ? '3px solid var(--color-primary)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 4,
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)'
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {svc.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        {svc.port}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={svc.status} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Concise Service Overview and Navigation Card */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <active.icon size={16} color="var(--color-primary)" />
              <span className="card-title">{active.name}</span>
            </div>
            <StatusBadge status={active.status} />
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              {active.description}
            </p>

            <div className="info-block" style={{ backgroundColor: '#FAFAFA' }}>
              <div className="info-block-label">Service Summary</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)', marginTop: 4 }}>
                {active.details.summary}
              </div>
            </div>

            <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
              {Object.entries(active.details).filter(([k]) => k !== 'summary').map(([key, val], idx) => (
                <div
                  key={key}
                  className="kv-row"
                  style={{
                    fontSize: 12,
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                    borderBottom: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <span style={{ color: 'var(--color-text-secondary)', textTransform: 'capitalize', flexShrink: 0 }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="mono text-truncate" style={{ fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{val}</span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: 12,
                  backgroundColor: '#FFFFFF'
                }}
              >
                <span style={{ color: 'var(--color-text-secondary)' }}>Binding Port</span>
                <span className="mono" style={{ fontWeight: 500 }}>{active.port}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                Need advanced daemon parameters?
              </span>

              <Link
                to={active.advancedPath}
                className="btn btn-primary btn-sm"
              >
                Configure in Advanced Settings
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
