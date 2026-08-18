import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { mockLocalServices } from '../../lib/mockData.js'
import { HardDrive, Database, Shield, Globe, ExternalLink } from 'lucide-react'

const ICONS = { HardDrive, Database, Shield, Globe }

export default function ClientServices() {
  return (
    <div>
      <PageHeader title="Local Services" subtitle="Services available on your SkyLink network" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {mockLocalServices.map(svc => {
          const Icon = ICONS[svc.icon] || Globe
          return (
            <div key={svc.name} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="var(--color-primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{svc.name}</span>
                    <StatusBadge status={svc.available ? 'active' : 'inactive'} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{svc.description}</div>
                  {svc.url && (
                    <a href={svc.url} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>
                      <ExternalLink size={11} />
                      {svc.url}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
