import { useState, useRef } from 'react'
import {
  Folder,
  File,
  Upload,
  Download,
  Trash2,
  HardDrive,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import DataTable from '../components/common/DataTable.jsx'
import ConfirmModal from '../components/common/ConfirmModal.jsx'
import useFilesStore from '../store/useFilesStore.js'
import { formatBytes } from '../lib/utils.js'
import { Link } from 'react-router-dom'

export default function FilesPage() {
  const files          = useFilesStore(s => s.files)
  const recentFiles    = useFilesStore(s => s.recentFiles)
  const currentFolder  = useFilesStore(s => s.currentFolder)
  const setFolder      = useFilesStore(s => s.setFolder)
  const uploadFile     = useFilesStore(s => s.uploadFile)
  const deleteFile     = useFilesStore(s => s.deleteFile)

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [activeTab, setActiveTab]         = useState('browse')
  const fileInputRef                      = useRef(null)

  const folders = [
    { id: 'media',     label: 'Media',     count: 1247 },
    { id: 'documents', label: 'Documents', count: 348  },
    { id: 'backup',    label: 'Backups',   count: 5892 },
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile({
        name: file.name,
        size: file.size,
      })
      e.target.value = ''
    }
  }

  const handleDownload = (fileName) => {
    // Generate simulated download file
    const element = document.createElement('a')
    const file = new Blob([`NetSense Local File Share content for: ${fileName}`], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const fileColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {row.isDir ? (
            <Folder size={15} color="var(--color-primary)" />
          ) : (
            <File size={15} color="var(--color-text-secondary)" />
          )}
          <span style={{ fontWeight: row.isDir ? 600 : 500 }}>{val}</span>
        </div>
      )
    },
    {
      key: 'size',
      label: 'File Size',
      sortable: true,
      render: (val, row) => (
        <span className="mono" style={{ fontSize: 12 }}>
          {row.isDir ? '—' : formatBytes(val || 0)}
        </span>
      )
    },
    {
      key: 'modified',
      label: 'Date Modified',
      sortable: true,
      render: (val) => (
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {val || 'Recent'}
        </span>
      )
    },
    {
      key: '_actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          {!row.isDir && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleDownload(row.name)}
              title="Download File"
            >
              <Download size={12} />
              Download
            </button>
          )}
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-danger)' }}
            onClick={() => setConfirmDelete(row.name)}
            title="Delete File"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Local File Sharing"
        subtitle="Manage and access files shared across the local NetSense network"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={13} />
              Upload File
            </button>
          </div>
        }
      />

      {/* Storage utilization block */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 4,
              backgroundColor: 'var(--color-primary-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <HardDrive size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Local Storage Pool</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                14.2 GB used of 32.0 GB total (eMMC Storage)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 140, height: 6, backgroundColor: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '44%', height: '100%', backgroundColor: 'var(--color-primary)' }} />
            </div>
            <Link to="/advanced/system" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', fontSize: 11 }}>
              Storage Settings
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Folder Navigation and File Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
        {/* Folder list */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <span className="card-title">Folders</span>
          </div>
          <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => setFolder(f.id)}
                className={`sidebar-nav-item ${currentFolder === f.id ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <Folder size={14} />
                <span style={{ flex: 1 }}>{f.label}</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Files in folder & Recent files */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Recent files list */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} color="var(--color-primary)" />
                <span className="card-title">Recent Files</span>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recentFiles.map((rf, idx) => (
                  <div
                    key={rf.name + idx}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 16px',
                      borderBottom: idx === recentFiles.length - 1 ? 'none' : '1px solid var(--color-border-subtle)',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      fontSize: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <File size={14} color="var(--color-text-secondary)" />
                      <div>
                        <div style={{ fontWeight: 500 }}>{rf.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                          Folder: /{rf.folder || currentFolder} · {formatBytes(rf.size || 0)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDownload(rf.name)}
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Folder Content Table */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Folder: /{currentFolder}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                {files.length} items
              </span>
            </div>
            <DataTable
              columns={fileColumns}
              rows={files}
              emptyText="Folder is currently empty."
              rowKey="name"
            />
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete File"
          message={`Are you sure you want to delete "${confirmDelete}" from local storage? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteFile(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
