import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import useVpnStore from '../../store/useVpnStore.js'
import { formatBytes } from '../../lib/utils.js'
import { Shield, Play, Square, Plus, Trash2, Copy } from 'lucide-react'

export default function AdminVpn() {
  const status     = useVpnStore(s => s.status)
  const peers      = useVpnStore(s => s.peers)
  const startVpn   = useVpnStore(s => s.start)
  const stopVpn    = useVpnStore(s => s.stop)
  const addPeer    = useVpnStore(s => s.addPeer)
  const removePeer = useVpnStore(s => s.removePeer)

  const [showAdd, setShowAdd] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm]       = useState({ name: '', publicKey: '', allowedIps: '', endpoint: '' })

  const isUp = status.status === 'up'

  const peerCols = [
    { key: 'name',          label: 'Name',            sortable: true },
    { key: 'publicKey',     label: 'Public Key',      mono: true, render: v => <span style={{ fontSize: 11 }}>{v.slice(0, 20)}…</span> },
    { key: 'allowedIps',    label: 'Allowed IPs',     mono: true },
    { key: 'endpoint',      label: 'Endpoint',        mono: true, render: v => v || <span style={{ color: 'var(--color-text-muted)' }}>dynamic</span> },
    { key: 'lastHandshake', label: 'Last Handshake',  render: v => <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{v}</span> },
    { key: 'rxBytes',       label: 'RX',              mono: true, render: v => <span style={{ color: 'var(--color-primary)' }}>{formatBytes(v)}</span> },
    { key: 'txBytes',       label: 'TX',              mono: true, render: v => <span style={{ color: 'var(--color-info)'    }}>{formatBytes(v)}</span> },
    {
      key: '_a', label: '', sortable: false,
      render: (_, row) => <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(row.id)}><Trash2 size={12} /></button>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="VPN (WireGuard)"
        subtitle="wg0 interface management and peer configuration"
        actions={
          isUp
            ? <button className="btn btn-danger btn-sm" onClick={stopVpn}><Square size={13} />Stop Tunnel</button>
            : <button className="btn btn-primary btn-sm" onClick={startVpn}><Play size={13} />Start Tunnel</button>
        }
      />

      {/* Status card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">Tunnel Status</span>
          <StatusBadge status={isUp ? 'up' : 'down'} />
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[
              ['Interface',   status.interface],
              ['Listen Port', status.listenPort],
              ['Peers',       status.peers],
              ['RX',          formatBytes(status.rxBytes)],
              ['TX',          formatBytes(status.txBytes)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="metric-label">{k}</div>
                <div style={{ marginTop: 4, fontWeight: 600, fontSize: 16 }} className="mono">{v}</div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="sl-field">
            <label className="sl-label">Server Public Key</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input className="sl-input mono" readOnly value={status.publicKey} style={{ fontSize: 12 }} />
              <button className="btn btn-ghost btn-sm" title="Copy" onClick={() => navigator.clipboard.writeText(status.publicKey)}>
                <Copy size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Peers */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Peers</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAdd(v => !v)}>
            <Plus size={13} />
            Add Peer
          </button>
        </div>
        {showAdd && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="sl-field"><label className="sl-label">Name</label><input className="sl-input" placeholder="e.g. Office Router" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="sl-field"><label className="sl-label">Endpoint (optional)</label><input className="sl-input mono" placeholder="203.0.113.10:51820" value={form.endpoint} onChange={e => setForm(f => ({ ...f, endpoint: e.target.value }))} /></div>
              <div className="sl-field"><label className="sl-label">Public Key</label><input className="sl-input mono" placeholder="base64 public key" value={form.publicKey} onChange={e => setForm(f => ({ ...f, publicKey: e.target.value }))} /></div>
              <div className="sl-field"><label className="sl-label">Allowed IPs</label><input className="sl-input mono" placeholder="10.0.0.2/32" value={form.allowedIps} onChange={e => setForm(f => ({ ...f, allowedIps: e.target.value }))} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => { addPeer(form); setShowAdd(false); setForm({ name: '', publicKey: '', allowedIps: '', endpoint: '' }) }}>Add Peer</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}
        <DataTable columns={peerCols} rows={peers} emptyText="No peers configured" />
      </div>

      {confirm && (
        <ConfirmModal
          title="Remove Peer"
          message="Remove this WireGuard peer?"
          confirmLabel="Remove"
          onConfirm={() => removePeer(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
