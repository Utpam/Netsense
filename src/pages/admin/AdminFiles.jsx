import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import useFilesStore from '../../store/useFilesStore.js'
import { HardDrive, Folder, FileText, Plus, Trash2 } from 'lucide-react'

export default function AdminFiles() {
  const shares      = useFilesStore(s => s.shares)
  const files       = useFilesStore(s => s.files)
  const addShare    = useFilesStore(s => s.addShare)
  const removeShare = useFilesStore(s => s.removeShare)
  const browse      = useFilesStore(s => s.browse)
  const currentShare = useFilesStore(s => s.currentShare)

  const [showAdd, setShowAdd] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm]       = useState({ name: '', path: '', readOnly: false, public: false })

  return (
    <div>
      <PageHeader
        title="File Server"
        subtitle="Samba shares and local file browser"
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAdd(v => !v)}>
            <Plus size={13} />
            Add Share
          </button>
        }
      />

      {/* Add share form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 16, padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
            <div className="sl-field"><label className="sl-label">Share Name</label><input className="sl-input" placeholder="media" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="sl-field"><label className="sl-label">Path</label><input className="sl-input mono" placeholder="/srv/media" value={form.path} onChange={e => setForm(f => ({ ...f, path: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.readOnly} onChange={e => setForm(f => ({ ...f, readOnly: e.target.checked }))} />
              Read Only
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.public} onChange={e => setForm(f => ({ ...f, public: e.target.checked }))} />
              Public (no auth)
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => { addShare(form); setShowAdd(false); setForm({ name: '', path: '', readOnly: false, public: false }) }}>Create Share</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Shares list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 20 }}>
        {shares.map(share => (
          <div key={share.name} className="card" style={{ cursor: 'pointer' }} onClick={() => browse(share.name, '/')}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HardDrive size={14} color="var(--color-primary)" />
                <span style={{ fontWeight: 600 }}>{share.name}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setConfirm(share.name) }}>
                <Trash2 size={12} />
              </button>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              <div className="mono" style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{share.path}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <StatusBadge variant={share.readOnly ? 'warning' : 'success'} label={share.readOnly ? 'Read Only' : 'Read/Write'} />
                <StatusBadge variant={share.public ? 'info' : 'neutral'} label={share.public ? 'Public' : 'Protected'} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>{share.files?.toLocaleString()} files</div>
            </div>
          </div>
        ))}
      </div>

      {/* File browser */}
      {currentShare && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Browse: {currentShare}</span>
          </div>
          <div>
            {files.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {f.isDir
                  ? <Folder size={15} color="var(--color-warning)" />
                  : <FileText size={15} color="var(--color-text-muted)" />}
                <span style={{ flex: 1, fontWeight: f.isDir ? 500 : 400 }}>{f.name}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {f.isDir ? '—' : `${(f.size / 1024).toFixed(1)} KB`}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{f.modified}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title="Remove Share"
          message={`Remove the "${confirm}" share? Files are not deleted.`}
          confirmLabel="Remove"
          onConfirm={() => removeShare(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
