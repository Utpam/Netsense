import { useState } from 'react'
import { Lock, Shield, Plus, Trash2, Check, AlertTriangle } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { mockFirewallRules } from '../../lib/mockData.js'
import { FW_ACTIONS } from '../../lib/constants.js'

export default function SecuritySection() {
  const [rules, setRules] = useState([...mockFirewallRules])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRule, setNewRule] = useState({
    direction: 'INPUT',
    proto: 'tcp',
    src: '0.0.0.0/0',
    dst: '192.168.1.1',
    dport: '8080',
    action: 'ACCEPT'
  })

  const handleAddRule = (e) => {
    e.preventDefault()
    const ruleObj = {
      ...newRule,
      id: Date.now()
    }
    setRules([...rules, ruleObj])
    setShowAddModal(false)
    setNewRule({ direction: 'INPUT', proto: 'tcp', src: '0.0.0.0/0', dst: '192.168.1.1', dport: '8080', action: 'ACCEPT' })
  }

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id))
  }

  const ruleCols = [
    { key: 'direction', label: 'Chain', mono: true, sortable: true },
    { key: 'proto', label: 'Protocol', mono: true, render: v => v.toUpperCase() },
    { key: 'src', label: 'Source IP', mono: true },
    { key: 'dst', label: 'Destination IP', mono: true },
    { key: 'dport', label: 'Port', mono: true },
    {
      key: 'action',
      label: 'Policy Action',
      sortable: true,
      render: v => <StatusBadge status={v} />
    },
    {
      key: '_action',
      label: '',
      sortable: false,
      render: (_, r) => (
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDeleteRule(r.id)}>
          <Trash2 size={12} />
        </button>
      )
    }
  ]

  return (
    <div>
      {/* ── Firewall Overview & Control ─────────────────────────── */}
      <SectionCard
        title="Linux Netfilter Firewall (iptables / nftables)"
        subtitle="Stateful packet inspection and port protection"
        badge={<StatusBadge status="active" label="Enabled" />}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={12} />
            Add Filter Rule
          </button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="info-block">
            <div className="info-block-label">Firewall State</div>
            <div className="info-block-value mono" style={{ fontSize: 16, color: 'var(--color-success)' }}>
              Enforcing
            </div>
            <div className="info-block-sub">Default WAN Policy: DROP</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Active Filter Rules</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {rules.length} Active Rules
            </div>
            <div className="info-block-sub">Kernel packet inspection</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Blocked Attempts</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              418 Dropped
            </div>
            <div className="info-block-sub">In the past 24 hours</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">SYN Flood Shield</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              Active
            </div>
            <div className="info-block-sub">Rate limiting enabled</div>
          </div>
        </div>

        <DataTable
          columns={ruleCols}
          rows={rules}
          emptyText="No firewall rules configured."
          rowKey="id"
        />
      </SectionCard>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create Firewall Filter Rule</span>
            </div>
            <form onSubmit={handleAddRule}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label">Chain / Direction</label>
                    <select
                      className="form-select mono"
                      value={newRule.direction}
                      onChange={e => setNewRule({ ...newRule, direction: e.target.value })}
                    >
                      <option value="INPUT">INPUT</option>
                      <option value="FORWARD">FORWARD</option>
                      <option value="OUTPUT">OUTPUT</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Protocol</label>
                    <select
                      className="form-select mono"
                      value={newRule.proto}
                      onChange={e => setNewRule({ ...newRule, proto: e.target.value })}
                    >
                      <option value="tcp">TCP</option>
                      <option value="udp">UDP</option>
                      <option value="icmp">ICMP (Ping)</option>
                      <option value="any">ANY</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Source IP / Mask</label>
                  <input
                    className="form-input mono"
                    placeholder="0.0.0.0/0"
                    value={newRule.src}
                    onChange={e => setNewRule({ ...newRule, src: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination IP / Mask</label>
                  <input
                    className="form-input mono"
                    placeholder="192.168.1.1"
                    value={newRule.dst}
                    onChange={e => setNewRule({ ...newRule, dst: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label">Target Port</label>
                    <input
                      className="form-input mono"
                      placeholder="e.g. 22 or 80"
                      value={newRule.dport}
                      onChange={e => setNewRule({ ...newRule, dport: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Filter Action</label>
                    <select
                      className="form-select mono"
                      value={newRule.action}
                      onChange={e => setNewRule({ ...newRule, action: e.target.value })}
                    >
                      {FW_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Firewall Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
