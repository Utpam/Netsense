import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import { mockLan, mockFirewallRules } from '../../lib/mockData.js'
import { Globe, Shield, Plus, Trash2, Save } from 'lucide-react'
import StatusBadge from '../../components/common/StatusBadge.jsx'

const tabs = ['LAN / DHCP', 'Firewall Rules']

export default function AdminGateway() {
  const [tab, setTab] = useState(0)
  const [lan, setLan] = useState({ ...mockLan })
  const [saved, setSaved] = useState(false)
  const [rules, setRules] = useState(mockFirewallRules)
  const [confirm, setConfirm] = useState(null)

  const saveLan = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const delRule = (id) => setRules(rules.filter(r => r.id !== id))

  const fwCols = [
    { key: 'direction', label: 'Chain',    render: v => <span className="badge badge-neutral">{v}</span> },
    { key: 'proto',     label: 'Protocol', mono: true },
    { key: 'src',       label: 'Source',   mono: true },
    { key: 'dst',       label: 'Dest',     mono: true },
    { key: 'dport',     label: 'Port',     mono: true },
    { key: 'action',    label: 'Action',   render: v => <StatusBadge status={v.toLowerCase()} /> },
    { key: '_a', label: '', sortable: false, render: (_, r) => <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(r.id)}><Trash2 size={12} /></button> },
  ]

  return (
    <div>
      <PageHeader title="Gateway" subtitle="LAN / DHCP configuration and firewall rules" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, background: 'var(--color-surface-1)', borderRadius: 6, padding: 3, width: 'fit-content' }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`btn ${tab === i ? 'btn-primary' : 'btn-ghost'} btn-sm`}>{t}</button>
        ))}
      </div>

      {/* LAN / DHCP */}
      {tab === 0 && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="card-header">
            <span className="card-title">LAN / DHCP Settings</span>
            <Globe size={15} color="var(--color-text-muted)" />
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Subnet',         'subnet',      'text'],
                ['Gateway IP',     'gatewayIp',   'text'],
                ['DHCP Start',     'dhcpStart',   'text'],
                ['DHCP End',       'dhcpEnd',     'text'],
                ['Lease Time',     'dhcpLease',   'text'],
                ['DNS Forwarder',  'dnsForward',  'text'],
              ].map(([label, key, type]) => (
                <div key={key} className="sl-field">
                  <label className="sl-label">{label}</label>
                  <input className="sl-input mono" type={type} value={lan[key]} onChange={e => setLan(l => ({ ...l, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={saveLan}><Save size={13} />Save Changes</button>
              {saved && <span style={{ color: 'var(--color-success)', fontSize: 12 }}>✓ Saved</span>}
            </div>
          </div>
        </div>
      )}

      {/* Firewall */}
      {tab === 1 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Firewall Rules</span>
            <Shield size={15} color="var(--color-text-muted)" />
          </div>
          <DataTable columns={fwCols} rows={rules} emptyText="No rules" />
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title="Delete Rule"
          message="Remove this firewall rule?"
          confirmLabel="Delete"
          onConfirm={() => delRule(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
