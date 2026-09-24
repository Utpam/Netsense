import { useState } from 'react'
import { Shield, Plus, Trash2, Key, Play, Pause, ExternalLink } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import useVpnStore from '../../store/useVpnStore.js'
import { formatBytes } from '../../lib/utils.js'

export default function VpnSection() {
  const status     = useVpnStore(s => s.status)
  const peers      = useVpnStore(s => s.peers)
  const start      = useVpnStore(s => s.start)
  const stop       = useVpnStore(s => s.stop)
  const addPeer    = useVpnStore(s => s.addPeer)
  const removePeer = useVpnStore(s => s.removePeer)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newPeer, setNewPeer]           = useState({ name: '', publicKey: '', allowedIps: '10.0.0.4/32', endpoint: '' })

  const isUp = status.status === 'up'

  const handleAddPeer = (e) => {
    e.preventDefault()
    if (!newPeer.name || !newPeer.publicKey) return
    addPeer({
      name: newPeer.name,
      publicKey: newPeer.publicKey,
      allowedIps: newPeer.allowedIps,
      endpoint: newPeer.endpoint || 'dynamic'
    })
    setNewPeer({ name: '', publicKey: '', allowedIps: '10.0.0.4/32', endpoint: '' })
    setShowAddModal(false)
  }

  const peerCols = [
    { key: 'name', label: 'Peer Identifier', sortable: true },
    { key: 'allowedIps', label: 'Allowed IPs', mono: true, sortable: true },
    { key: 'endpoint', label: 'Endpoint', mono: true },
    { key: 'lastHandshake', label: 'Latest Handshake', render: v => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{v}</span> },
    { key: 'rxBytes', label: 'Transfer In', mono: true, render: v => formatBytes(v) },
    { key: 'txBytes', label: 'Transfer Out', mono: true, render: v => formatBytes(v) },
    {
      key: '_action',
      label: '',
      sortable: false,
      render: (_, r) => (
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => removePeer(r.id)}>
          <Trash2 size={12} />
        </button>
      )
    }
  ]

  return (
    <div>
      {/* ── WireGuard Tunnel Overview ───────────────────────────── */}
      <SectionCard
        title="WireGuard VPN Tunnel"
        subtitle="Kernel-level encrypted point-to-point network tunnel"
        badge={<StatusBadge status={isUp ? 'active' : 'disabled'} />}
        actions={
          <div className="btn-row">
            <button
              className={`btn ${isUp ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              onClick={isUp ? stop : start}
            >
              {isUp ? <Pause size={12} /> : <Play size={12} />}
              {isUp ? 'Stop WireGuard' : 'Start WireGuard'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={12} />
              Add Peer
            </button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="info-block">
            <div className="info-block-label">Interface & Port</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {status.interface || 'wg0'} : {status.listenPort || 51820}
            </div>
            <div className="info-block-sub">UDP Listen Port</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Active Peers</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {peers.length} Configured
            </div>
            <div className="info-block-sub">Point-to-point clients</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">VPN Ingress / Egress</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>
              ↓ {formatBytes(status.rxBytes || 0)} / ↑ {formatBytes(status.txBytes || 0)}
            </div>
            <div className="info-block-sub">Encrypted transfer</div>
          </div>
        </div>

        <div style={{ padding: '8px 12px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border-subtle)', borderRadius: 4, marginBottom: 16 }}>
          <div className="info-block-label" style={{ marginBottom: 2 }}>Public Key of this Router</div>
          <div className="mono" style={{ fontSize: 11, wordBreak: 'break-all', color: 'var(--color-text)' }}>
            {status.publicKey}
          </div>
        </div>

        <DataTable
          columns={peerCols}
          rows={peers}
          emptyText="No WireGuard peers configured."
          rowKey="id"
        />
      </SectionCard>

      {/* Add Peer Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add WireGuard Peer</span>
            </div>
            <form onSubmit={handleAddPeer}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Peer Name / Description</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Field Sensor Node #3"
                    value={newPeer.name}
                    onChange={e => setNewPeer({ ...newPeer, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Peer Public Key (Base64)</label>
                  <input
                    className="form-input mono"
                    placeholder="e.g. HIgo9xNzJMWLKASShiTqIybx..."
                    value={newPeer.publicKey}
                    onChange={e => setNewPeer({ ...newPeer, publicKey: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Allowed IPs (VPN IP assignment)</label>
                  <input
                    className="form-input mono"
                    placeholder="10.0.0.4/32"
                    value={newPeer.allowedIps}
                    onChange={e => setNewPeer({ ...newPeer, allowedIps: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Remote Endpoint (Optional)</label>
                  <input
                    className="form-input mono"
                    placeholder="e.g. 203.0.113.10:51820 or leave blank for dynamic"
                    value={newPeer.endpoint}
                    onChange={e => setNewPeer({ ...newPeer, endpoint: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Peer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
