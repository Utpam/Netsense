import { useState, useEffect } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import useDnsStore from '../../store/useDnsStore.js'
import { Database, Trash2, Plus, RotateCcw, RefreshCw } from 'lucide-react'
import { DNS_RECORD_TYPES } from '../../lib/constants.js'

const tabs = ['Overview', 'Custom Records', 'Blocklist', 'Query Log', 'Upstream']

export default function AdminDns() {
  const status        = useDnsStore(s => s.status)
  const records       = useDnsStore(s => s.records)
  const blocklist     = useDnsStore(s => s.blocklist)
  const upstream      = useDnsStore(s => s.upstream)
  const log           = useDnsStore(s => s.log)
  const fetchStatus   = useDnsStore(s => s.fetchStatus)
  const flush         = useDnsStore(s => s.flushCache)
  const addRecord     = useDnsStore(s => s.addRecord)
  const delRecord     = useDnsStore(s => s.deleteRecord)
  const addBlock      = useDnsStore(s => s.addBlock)
  const delBlock      = useDnsStore(s => s.deleteBlock)
  const setUpstream   = useDnsStore(s => s.setUpstream)

  const [tab, setTab]         = useState(0)
  const [confirm, setConfirm] = useState(null)

  const [recForm, setRecForm] = useState({ hostname: '', ip: '', type: 'A' })
  const [blkForm, setBlkForm] = useState({ domain: '', reason: '' })
  const [upEdit,  setUpEdit]  = useState(upstream.join('\n'))
  const [showRecForm, setShowRecForm] = useState(false)
  const [showBlkForm, setShowBlkForm] = useState(false)

  useEffect(() => {
    fetchStatus()
  }, [])

  const recordCols = [
    { key: 'hostname', label: 'Hostname',    mono: true, sortable: true },
    { key: 'ip',       label: 'IP Address',  mono: true, sortable: true },
    { key: 'type',     label: 'Type',        render: v => <span className="badge badge-info">{v}</span> },
    { key: 'createdAt',label: 'Created',     render: v => <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{v}</span> },
    { key: '_a', label: '', sortable: false,  render: (_, row) => <button className="btn btn-ghost btn-sm" onClick={() => setConfirm({ type: 'rec', id: row.id })}><Trash2 size={12} /></button> },
  ]

  const blockCols = [
    { key: 'domain',    label: 'Domain',    mono: true, sortable: true },
    { key: 'reason',    label: 'Reason',    sortable: true, render: v => <span style={{ color: 'var(--color-text-muted)' }}>{v}</span> },
    { key: 'createdAt', label: 'Added',     render: v => <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{v}</span> },
    { key: '_a', label: '', sortable: false, render: (_, row) => <button className="btn btn-ghost btn-sm" onClick={() => setConfirm({ type: 'blk', id: row.id })}><Trash2 size={12} /></button> },
  ]

  const logResultColor = { HIT: 'var(--color-success)', MISS: 'var(--color-text-muted)', BLOCK: 'var(--color-danger)' }

  return (
    <div>
      <PageHeader
        title="DNS Cache Server"
        subtitle="dnsmasq · local DNS resolver and cache"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={fetchStatus}>
              <RefreshCw size={13} />
              Refresh
            </button>
            <button className="btn btn-secondary btn-sm" onClick={flush}>
              <RotateCcw size={13} />
              Flush Cache
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, background: 'var(--color-surface-1)', borderRadius: 6, padding: 3, width: 'fit-content' }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`btn ${tab === i ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'Status',        value: <StatusBadge status={status.running ? 'active' : 'inactive'} /> },
            { label: 'Server',        value: status.server || '1.1.1.1', mono: true },
            { label: 'Cache Size',    value: status.cacheSize, unit: 'max' },
            { label: 'Cached',        value: status.cacheEntries, unit: 'entries' },
            { label: 'Hit Rate',      value: `${Math.round((status.hitRate || 0) * 100)}%` },
            { label: 'Total Queries', value: (status.queriesTotal || 0).toLocaleString() },
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: '12px 16px' }}>
              <div className="metric-label">{m.label}</div>
              <div style={{ marginTop: 8, fontSize: m.mono ? 16 : 22, fontWeight: 700 }} className={m.mono ? 'mono' : ''}>
                {m.value}{m.unit && <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 4 }}>{m.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Records */}
      {tab === 1 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Custom DNS Records</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowRecForm(v => !v)}>
              <Plus size={13} />
              Add Record
            </button>
          </div>
          {showRecForm && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div className="sl-field"><label className="sl-label">Hostname</label><input className="sl-input mono" placeholder="nas.skylink" value={recForm.hostname} onChange={e => setRecForm(f => ({ ...f, hostname: e.target.value }))} /></div>
              <div className="sl-field"><label className="sl-label">IP Address</label><input className="sl-input mono" placeholder="192.168.1.10" value={recForm.ip} onChange={e => setRecForm(f => ({ ...f, ip: e.target.value }))} /></div>
              <div className="sl-field"><label className="sl-label">Type</label><select className="sl-input" value={recForm.type} onChange={e => setRecForm(f => ({ ...f, type: e.target.value }))}>{DNS_RECORD_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              <button className="btn btn-primary btn-sm" onClick={() => { addRecord(recForm); setShowRecForm(false); setRecForm({ hostname: '', ip: '', type: 'A' }) }}>Save</button>
            </div>
          )}
          <DataTable columns={recordCols} rows={records} emptyText="No custom records" searchable />
        </div>
      )}

      {/* Blocklist */}
      {tab === 2 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Domain Blocklist</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowBlkForm(v => !v)}>
              <Plus size={13} />
              Add Domain
            </button>
          </div>
          {showBlkForm && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: 10, alignItems: 'end' }}>
              <div className="sl-field"><label className="sl-label">Domain</label><input className="sl-input mono" placeholder="ads.example.com" value={blkForm.domain} onChange={e => setBlkForm(f => ({ ...f, domain: e.target.value }))} /></div>
              <div className="sl-field"><label className="sl-label">Reason</label><input className="sl-input" placeholder="Advertising" value={blkForm.reason} onChange={e => setBlkForm(f => ({ ...f, reason: e.target.value }))} /></div>
              <button className="btn btn-primary btn-sm" onClick={() => { addBlock(blkForm); setShowBlkForm(false); setBlkForm({ domain: '', reason: '' }) }}>Add</button>
            </div>
          )}
          <DataTable columns={blockCols} rows={blocklist} emptyText="No blocked domains" searchable />
        </div>
      )}

      {/* Log */}
      {tab === 3 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Query Log</span>
            <button className="btn btn-ghost btn-sm" onClick={fetchStatus}><RefreshCw size={13} /></button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="sl-table">
              <thead>
                <tr><th>Time</th><th>Client</th><th>Query</th><th>Type</th><th>Result</th><th>Answer</th></tr>
              </thead>
              <tbody>
                {log.map((l, i) => (
                  <tr key={i}>
                    <td className="mono" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{l.time}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{l.client}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{l.query}</td>
                    <td><span className="badge badge-neutral">{l.type}</span></td>
                    <td><span style={{ color: logResultColor[l.result], fontWeight: 600, fontSize: 11 }}>{l.result}</span></td>
                    <td className="mono" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upstream */}
      {tab === 4 && (
        <div className="card" style={{ maxWidth: 500 }}>
          <div className="card-header"><span className="card-title">Upstream DNS Servers</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>One server per line. Will sync via PUT /api/dns/config.</p>
            <textarea
              className="sl-input mono"
              rows={5}
              value={upEdit}
              onChange={e => setUpEdit(e.target.value)}
              style={{ resize: 'vertical' }}
            />
            <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setUpstream(upEdit.trim().split('\n').map(s => s.trim()).filter(Boolean))}>
              Save Upstream Servers
            </button>
          </div>
        </div>
      )}

      {confirm?.type === 'rec' && <ConfirmModal title="Delete Record" message="Remove this DNS record?" confirmLabel="Delete" onConfirm={() => delRecord(confirm.id)} onCancel={() => setConfirm(null)} />}
      {confirm?.type === 'blk' && <ConfirmModal title="Remove from Blocklist" message="Unblock this domain?" confirmLabel="Remove" onConfirm={() => delBlock(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
