import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import { mockInterfaces, mockWan, mockRoutes } from '../../lib/mockData.js'
import { formatBytes, formatRate } from '../../lib/utils.js'
import { Network, RefreshCw } from 'lucide-react'

export default function AdminNetwork() {
  const ifaceCols = [
    { key: 'name',        label: 'Interface',   mono: true, sortable: true,
      render: (v, row) => <div><span style={{ fontWeight: 600 }}>{v}</span><div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.description}</div></div> },
    { key: 'state',       label: 'State',       render: v => <StatusBadge status={v === 'up' ? 'up' : 'down'} /> },
    { key: 'ip',          label: 'IP / Mask',   mono: true, render: (v, row) => `${v}${row.mask}` },
    { key: 'mac',         label: 'MAC',         mono: true, render: v => v !== 'N/A' ? v.toUpperCase() : <span style={{ color: 'var(--color-text-muted)' }}>N/A</span> },
    { key: 'rx',          label: 'Total RX',    mono: true, render: v => <span style={{ color: 'var(--color-primary)' }}>{formatBytes(v)}</span> },
    { key: 'tx',          label: 'Total TX',    mono: true, render: v => <span style={{ color: 'var(--color-info)'    }}>{formatBytes(v)}</span> },
    { key: 'rxRate',      label: 'Rate ↓',      mono: true, render: v => v ? <span style={{ color: 'var(--color-primary)' }}>{formatRate(v)}</span> : '—' },
    { key: 'txRate',      label: 'Rate ↑',      mono: true, render: v => v ? <span style={{ color: 'var(--color-info)'    }}>{formatRate(v)}</span> : '—' },
  ]

  const routeCols = [
    { key: 'destination', label: 'Destination', mono: true },
    { key: 'gateway',     label: 'Gateway',     mono: true, render: v => v === '0.0.0.0' ? <span style={{ color: 'var(--color-text-muted)' }}>direct</span> : v },
    { key: 'iface',       label: 'Interface',   mono: true },
    { key: 'metric',      label: 'Metric',      mono: true },
  ]

  return (
    <div>
      <PageHeader
        title="Network Interfaces"
        subtitle="Network interface statistics and IP routing table"
        actions={<button className="btn btn-secondary btn-sm"><RefreshCw size={13} />Refresh</button>}
      />

      {/* WAN summary */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">WAN Connection</span>
          <StatusBadge status={mockWan.state === 'connected' ? 'connected' : 'disconnected'} dot />
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {[
              ['Interface',   mockWan.iface],
              ['WAN IP',      mockWan.ip],
              ['Gateway',     mockWan.gateway],
              ['Primary DNS', mockWan.dns[0]],
              ['Alt DNS',     mockWan.dns[1]],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="metric-label">{k}</div>
                <div className="mono" style={{ marginTop: 4, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interfaces table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">Interfaces</span>
          <Network size={15} color="var(--color-text-muted)" />
        </div>
        <DataTable columns={ifaceCols} rows={mockInterfaces} rowKey="name" emptyText="No interfaces" />
      </div>

      {/* Routing table */}
      <div className="card">
        <div className="card-header"><span className="card-title">Routing Table</span></div>
        <DataTable columns={routeCols} rows={mockRoutes} rowKey="destination" emptyText="No routes" />
      </div>
    </div>
  )
}
