import { useState } from 'react'
import { Sliders, Plus, Trash2, Check, Save } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import useQosStore from '../../store/useQosStore.js'
import { QOS_PRIORITIES } from '../../lib/constants.js'

export default function QosSection() {
  const rules       = useQosStore(s => s.rules)
  const status      = useQosStore(s => s.status)
  const addRule     = useQosStore(s => s.addRule)
  const toggleRule  = useQosStore(s => s.toggleRule)
  const deleteRule  = useQosStore(s => s.deleteRule)
  const apply       = useQosStore(s => s.apply)
  const applied     = useQosStore(s => s.applied)

  const [newRule, setNewRule] = useState({
    name: '',
    target: '',
    priority: 4,
    downloadKbps: 10000,
    uploadKbps: 2000
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleAddRule = (e) => {
    e.preventDefault()
    if (!newRule.name || !newRule.target) return
    addRule({
      name: newRule.name,
      target: newRule.target,
      priority: Number(newRule.priority),
      downloadKbps: Number(newRule.downloadKbps),
      uploadKbps: Number(newRule.uploadKbps),
    })
    setNewRule({ name: '', target: '', priority: 4, downloadKbps: 10000, uploadKbps: 2000 })
    setShowAddModal(false)
  }

  const handleApplyChanges = () => {
    apply()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const ruleCols = [
    { key: 'name', label: 'Rule Name', sortable: true },
    { key: 'target', label: 'Target IP / Host', mono: true, sortable: true },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: v => {
        const item = QOS_PRIORITIES.find(p => p.value === v)
        return <span className="badge badge-info">{item ? item.label : `Priority ${v}`}</span>
      }
    },
    {
      key: 'downloadKbps',
      label: 'Max Download',
      mono: true,
      render: v => `${(v / 1000).toFixed(1)} Mbps`
    },
    {
      key: 'uploadKbps',
      label: 'Max Upload',
      mono: true,
      render: v => `${(v / 1000).toFixed(1)} Mbps`
    },
    {
      key: 'enabled',
      label: 'Status',
      render: (v, r) => (
        <button
          className={`btn ${v ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => toggleRule(r.id)}
          style={{ padding: '2px 8px', fontSize: 11 }}
        >
          {v ? 'Active' : 'Disabled'}
        </button>
      )
    },
    {
      key: '_action',
      label: '',
      sortable: false,
      render: (_, r) => (
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--color-danger)' }}
          onClick={() => deleteRule(r.id)}
        >
          <Trash2 size={12} />
        </button>
      )
    }
  ]

  return (
    <div>
      {/* ── Overview Card ───────────────────────────────────────── */}
      <SectionCard
        title="QoS Bandwidth & Traffic Management"
        subtitle="Hierarchical Token Bucket (HTB) queue discipline"
        badge={<StatusBadge status={status.enabled ? 'active' : 'disabled'} />}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={12} />
              Add QoS Rule
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={applied}
              onClick={handleApplyChanges}
            >
              <Check size={12} />
              {applied ? 'Applied' : 'Apply Changes'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="info-block">
            <div className="info-block-label">QoS Discipline Mode</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{status.mode}</div>
            <div className="info-block-sub">Uplink Interface: {status.interface}</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Global Bandwidth Cap</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>
              ↓ {(status.globalDownKbps / 1000).toFixed(0)} / ↑ {(status.globalUpKbps / 1000).toFixed(0)} Mbps
            </div>
            <div className="info-block-sub">Total allocated pipe capacity</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Configured Rules</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>
              {rules.length} Rules ({rules.filter(r => r.enabled).length} Enabled)
            </div>
            <div className="info-block-sub">Policy enforcement active</div>
          </div>
        </div>

        {savedSuccess && (
          <div className="alert-box alert-success" style={{ marginBottom: 12 }}>
            <Check size={14} color="var(--color-success)" />
            <span>QoS traffic shaper configuration applied to kernel queue scheduler.</span>
          </div>
        )}

        <DataTable
          columns={ruleCols}
          rows={rules}
          emptyText="No QoS rules configured."
          rowKey="id"
        />
      </SectionCard>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create QoS Traffic Rule</span>
            </div>
            <form onSubmit={handleAddRule}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Rule Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Work Laptop Priority"
                    value={newRule.name}
                    onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target IP Address / Subnet</label>
                  <input
                    className="form-input mono"
                    placeholder="192.168.1.107 or 0.0.0.0/0"
                    value={newRule.target}
                    onChange={e => setNewRule({ ...newRule, target: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Traffic Priority Class</label>
                  <select
                    className="form-select"
                    value={newRule.priority}
                    onChange={e => setNewRule({ ...newRule, priority: Number(e.target.value) })}
                  >
                    {QOS_PRIORITIES.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label">Max Download (Kbps)</label>
                    <input
                      type="number"
                      className="form-input mono"
                      value={newRule.downloadKbps}
                      onChange={e => setNewRule({ ...newRule, downloadKbps: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Upload (Kbps)</label>
                    <input
                      type="number"
                      className="form-input mono"
                      value={newRule.uploadKbps}
                      onChange={e => setNewRule({ ...newRule, uploadKbps: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
