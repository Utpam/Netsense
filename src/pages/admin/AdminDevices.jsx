import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import useDeviceStore from '../../store/useDeviceStore.js'
import { formatBytes, formatMac, timeAgo } from '../../lib/utils.js'
import { RefreshCw, Ban, Check, Trash2, Edit3, Users } from 'lucide-react'

export default function AdminDevices() {
  const devices  = useDeviceStore(s => s.devices)
  const block    = useDeviceStore(s => s.block)
  const unblock  = useDeviceStore(s => s.unblock)
  const remove   = useDeviceStore(s => s.remove)
  const setName  = useDeviceStore(s => s.setName)

  const [confirm, setConfirm]   = useState(null)
  const [editing, setEditing]   = useState(null)   // { mac, name }
  const [editVal, setEditVal]   = useState('')

  const online  = devices.filter(d => d.online).length
  const blocked = devices.filter(d => d.blocked).length

  const startEdit = (d) => { setEditing(d.mac); setEditVal(d.name) }
  const saveEdit  = (mac) => { setName(mac, editVal.trim() || 'Unknown'); setEditing(null) }

  const columns = [
    {
      key: 'online', label: 'Status', sortable: true,
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot" style={{ background: v ? 'var(--color-success)' : 'var(--color-border-strong)', animationPlayState: v ? 'running' : 'paused' }} />
          <StatusBadge status={row.blocked ? 'blocked' : v ? 'online' : 'offline'} />
        </div>
      ),
    },
    {
      key: 'name', label: 'Name / Hostname', sortable: true,
      render: (v, row) => (
        <div>
          {editing === row.mac ? (
            <div style={{ display: 'flex', gap: 4 }}>
              <input
                className="sl-input"
                style={{ padding: '2px 6px', fontSize: 12, width: 140 }}
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && saveEdit(row.mac)}
              />
              <button className="btn btn-sm btn-primary" onClick={() => saveEdit(row.mac)}>✓</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setEditing(null)}>✕</button>
            </div>
          ) : (
            <div>
              <span style={{ fontWeight: 500 }}>{v}</span>
              <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px', marginLeft: 4 }} onClick={() => startEdit(row)}>
                <Edit3 size={11} />
              </button>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }} className="mono">{row.hostname}</div>
            </div>
          )}
        </div>
      ),
    },
    { key: 'ip',  label: 'IP Address',  mono: true, sortable: true },
    { key: 'mac', label: 'MAC',         mono: true, render: v => formatMac(v) },
    { key: 'vendor', label: 'Vendor',   sortable: true, render: v => <span style={{ color: 'var(--color-text-muted)' }}>{v}</span> },
    {
      key: 'rx', label: 'RX / TX', sortable: true,
      render: (v, row) => (
        <div className="mono" style={{ fontSize: 12 }}>
          <div style={{ color: 'var(--color-primary)' }}>↓ {formatBytes(row.rx)}</div>
          <div style={{ color: 'var(--color-info)' }}>↑ {formatBytes(row.tx)}</div>
        </div>
      ),
    },
    { key: 'lastSeen', label: 'Last Seen', sortable: true, render: v => <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{timeAgo(v)}</span> },
    {
      key: '_actions', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 4 }}>
          {row.blocked ? (
            <button className="btn btn-sm btn-secondary" onClick={() => unblock(row.mac)} title="Unblock">
              <Check size={12} />
            </button>
          ) : (
            <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ type: 'block', mac: row.mac, name: row.name })} title="Block">
              <Ban size={12} />
            </button>
          )}
          <button
            className="btn btn-sm btn-ghost"
            title="Remove"
            onClick={() => setConfirm({ type: 'remove', mac: row.mac, name: row.name })}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Connected Devices"
        subtitle={`${online} online · ${blocked} blocked · ${devices.length} total`}
        actions={
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={13} />
            Refresh
          </button>
        }
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total',   value: devices.length, color: 'var(--color-text)' },
          { label: 'Online',  value: online,          color: 'var(--color-success)' },
          { label: 'Blocked', value: blocked,          color: 'var(--color-danger)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: s.color }} className="mono">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Device List</span>
          <Users size={15} color="var(--color-text-muted)" />
        </div>
        <DataTable
          columns={columns}
          rows={devices}
          rowKey="mac"
          searchable
          searchKeys={['name', 'hostname', 'ip', 'mac', 'vendor']}
          emptyText="No devices"
        />
      </div>

      {/* Confirm modals */}
      {confirm?.type === 'block' && (
        <ConfirmModal
          title="Block Device"
          message={`Block "${confirm.name}" (${confirm.mac})? The device will lose internet access immediately.`}
          confirmLabel="Block"
          variant="danger"
          onConfirm={() => block(confirm.mac)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.type === 'remove' && (
        <ConfirmModal
          title="Remove Device"
          message={`Remove "${confirm.name}" from the known device list?`}
          confirmLabel="Remove"
          variant="danger"
          onConfirm={() => remove(confirm.mac)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
