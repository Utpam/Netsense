import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import useQosStore from '../../store/useQosStore.js'
import { QOS_PRIORITIES } from '../../lib/constants.js'
import { Sliders, Plus, Trash2, Edit3, Play, RotateCcw, CheckCircle } from 'lucide-react'

const BLANK_RULE = { name: '', target: '', priority: 4, downloadKbps: 10000, uploadKbps: 5000 }

export default function AdminQoS() {
  const rules      = useQosStore(s => s.rules)
  const status     = useQosStore(s => s.status)
  const applied    = useQosStore(s => s.applied)
  const addRule    = useQosStore(s => s.addRule)
  const updateRule = useQosStore(s => s.updateRule)
  const deleteRule = useQosStore(s => s.deleteRule)
  const toggleRule = useQosStore(s => s.toggleRule)
  const applyRules = useQosStore(s => s.apply)
  const resetRules = useQosStore(s => s.reset)

  const [showEditor, setShowEditor] = useState(false)
  const [editTarget, setEditTarget] = useState(null)       // null = new
  const [form, setForm]             = useState(BLANK_RULE)
  const [confirm, setConfirm]       = useState(null)

  const openNew  = () => { setForm(BLANK_RULE); setEditTarget(null); setShowEditor(true) }
  const openEdit = (rule) => { setForm({ name: rule.name, target: rule.target, priority: rule.priority, downloadKbps: rule.downloadKbps, uploadKbps: rule.uploadKbps }); setEditTarget(rule.id); setShowEditor(true) }

  const saveForm = () => {
    if (editTarget) updateRule(editTarget, form)
    else             addRule(form)
    setShowEditor(false)
  }

  const columns = [
    {
      key: 'enabled', label: 'Active', sortable: true,
      render: (v, row) => (
        <button className={`badge ${v ? 'badge-success' : 'badge-neutral'}`} style={{ cursor: 'pointer', border: 'none' }} onClick={() => toggleRule(row.id)}>
          {v ? 'On' : 'Off'}
        </button>
      ),
    },
    { key: 'name',         label: 'Rule Name',       sortable: true },
    { key: 'target',       label: 'Target (IP/MAC)', mono: true,   sortable: true },
    {
      key: 'priority', label: 'Priority', sortable: true,
      render: v => {
        const p = QOS_PRIORITIES.find(p => p.value === v)
        return <span className="badge badge-info">{p?.label ?? v}</span>
      },
    },
    {
      key: 'downloadKbps', label: 'Download Limit', sortable: true, mono: true,
      render: v => v ? `${(v / 1000).toFixed(0)} Mbps` : 'Unlimited',
    },
    {
      key: 'uploadKbps', label: 'Upload Limit', sortable: true, mono: true,
      render: v => v ? `${(v / 1000).toFixed(0)} Mbps` : 'Unlimited',
    },
    {
      key: '_actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-sm btn-secondary" onClick={() => openEdit(row)}><Edit3 size={12} /></button>
          <button className="btn btn-sm btn-danger"    onClick={() => setConfirm(row.id)}><Trash2 size={12} /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Quality of Service"
        subtitle="Traffic shaping and bandwidth allocation via HTB"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            {!applied && (
              <span className="badge badge-warning" style={{ alignSelf: 'center' }}>Unapplied changes</span>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirm('reset')}>
              <RotateCcw size={13} />
              Reset
            </button>
            <button className="btn btn-primary btn-sm" onClick={applyRules}>
              <Play size={13} />
              Apply Rules
            </button>
            <button className="btn btn-secondary btn-sm" onClick={openNew}>
              <Plus size={13} />
              Add Rule
            </button>
          </div>
        }
      />

      {/* Status bar */}
      <div className="card" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
          {[
            ['Mode',       status.mode],
            ['Interface',  status.interface],
            ['Global DL',  `${(status.globalDownKbps / 1000).toFixed(0)} Mbps`],
            ['Global UL',  `${(status.globalUpKbps  / 1000).toFixed(0)} Mbps`],
            ['Rules',      `${rules.filter(r => r.enabled).length} active / ${rules.length} total`],
          ].map(([k, v]) => (
            <div key={k}>
              <span style={{ color: 'var(--color-text-muted)', marginRight: 6 }}>{k}</span>
              <span className="mono">{v}</span>
            </div>
          ))}
          {applied && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={13} color="var(--color-success)" /><span style={{ color: 'var(--color-success)', fontSize: 12 }}>Rules applied</span></div>}
        </div>
      </div>

      {/* Rules table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">QoS Rules</span>
          <Sliders size={15} color="var(--color-text-muted)" />
        </div>
        <DataTable columns={columns} rows={rules} emptyText="No rules configured" />
      </div>

      {/* Rule editor modal */}
      {showEditor && (
        <div className="modal-overlay" onClick={() => setShowEditor(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editTarget ? 'Edit Rule' : 'New QoS Rule'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowEditor(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="sl-field">
                <label className="sl-label">Rule Name</label>
                <input className="sl-input" placeholder="e.g. Video Streaming" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="sl-field">
                <label className="sl-label">Target (IP, MAC, or subnet)</label>
                <input className="sl-input mono" placeholder="192.168.1.101 or aa:bb:cc:… or 0.0.0.0/0" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
              </div>
              <div className="sl-field">
                <label className="sl-label">Priority</label>
                <select className="sl-input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: +e.target.value }))}>
                  {QOS_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.value} — {p.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="sl-field">
                  <label className="sl-label">Download Limit (Kbps)</label>
                  <input className="sl-input mono" type="number" min={0} value={form.downloadKbps} onChange={e => setForm(f => ({ ...f, downloadKbps: +e.target.value }))} />
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>0 = unlimited</span>
                </div>
                <div className="sl-field">
                  <label className="sl-label">Upload Limit (Kbps)</label>
                  <input className="sl-input mono" type="number" min={0} value={form.uploadKbps} onChange={e => setForm(f => ({ ...f, uploadKbps: +e.target.value }))} />
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>0 = unlimited</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEditor(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={saveForm}>Save Rule</button>
            </div>
          </div>
        </div>
      )}

      {confirm && confirm !== 'reset' && (
        <ConfirmModal
          title="Delete Rule"
          message="Delete this QoS rule? The change won't take effect until you Apply."
          confirmLabel="Delete"
          onConfirm={() => deleteRule(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'reset' && (
        <ConfirmModal
          title="Reset All Rules"
          message="This will remove all QoS rules immediately."
          confirmLabel="Reset"
          onConfirm={resetRules}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
