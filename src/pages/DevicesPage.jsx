import { useState } from 'react'
import { Laptop, Pause, Play, ArrowRight } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import DataTable from '../components/common/DataTable.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import DeviceDetailModal from '../components/common/DeviceDetailModal.jsx'
import useDeviceStore from '../store/useDeviceStore.js'
import { formatBytes } from '../lib/utils.js'
import { Link } from 'react-router-dom'

export default function DevicesPage() {
  const devices      = useDeviceStore(s => s.devices)
  const toggleBlock  = useDeviceStore(s => s.toggleBlock)
  const updateDevice = useDeviceStore(s => s.updateDevice)

  const [selectedDevice, setSelectedDevice] = useState(null)

  const columns = [
    {
      key: 'name',
      label: 'Device',
      sortable: true,
      render: (val, row) => (
        <button
          className="btn btn-ghost"
          style={{ padding: 0, textAlign: 'left', color: 'var(--color-primary)', fontWeight: 600, minHeight: 'auto' }}
          onClick={() => setSelectedDevice(row)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Laptop size={14} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
            <div>
              <div className="text-truncate" style={{ maxWidth: 140 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 400 }}>{row.vendor || 'Unknown'}</div>
            </div>
          </div>
        </button>
      )
    },
    {
      key: 'connection',
      label: 'Connection',
      sortable: false,
      render: (_, row) => (
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          {row.vendor === 'Synology' ? 'Ethernet' : 'Wi-Fi'}
        </span>
      )
    },
    {
      key: 'online',
      label: 'Status',
      sortable: true,
      render: (online, row) =>
        row.blocked
          ? <StatusBadge status="blocked" label="Paused" />
          : <StatusBadge status={online ? 'connected' : 'offline'} />
    },
    {
      key: 'ip',
      label: 'IP',
      mono: true,
      sortable: true
    },
    {
      key: 'usage',
      label: 'Usage',
      sortable: false,
      render: (_, row) => (
        <span className="mono" style={{ fontSize: 11 }}>
          {formatBytes((row.rx || 0) + (row.tx || 0))}
        </span>
      )
    },
    {
      key: '_actions',
      label: '',
      sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedDevice(row)}
          >
            Details
          </button>
          <button
            className={`btn ${row.blocked ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => toggleBlock(row.mac)}
            title={row.blocked ? 'Resume internet access' : 'Pause internet access'}
          >
            {row.blocked ? <Play size={11} /> : <Pause size={11} />}
            {row.blocked ? 'Resume' : 'Pause'}
          </button>
        </div>
      )
    }
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Connected Devices"
        subtitle="Manage devices on the local network"
        actions={
          <div className="btn-row">
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {devices.length} total · {devices.filter(d => d.online).length} online
            </span>
            <Link to="/advanced/qos" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
              QoS Limits <ArrowRight size={11} />
            </Link>
          </div>
        }
      />

      <div className="card">
        <DataTable
          columns={columns}
          rows={devices}
          searchable
          searchKeys={['name', 'ip', 'mac', 'vendor', 'hostname']}
          emptyText="No connected devices found."
          rowKey="mac"
        />
      </div>

      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdateDevice={(mac, patch) => {
            updateDevice(mac, patch)
            setSelectedDevice(prev => ({ ...prev, ...patch }))
          }}
          onToggleBlock={(mac) => {
            toggleBlock(mac)
            setSelectedDevice(prev => ({ ...prev, blocked: !prev.blocked }))
          }}
        />
      )}
    </div>
  )
}
