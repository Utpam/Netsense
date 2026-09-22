import { useState } from 'react'
import { Laptop, Wifi, ArrowUpDown, Pause, Play, Edit3, ArrowRight } from 'lucide-react'
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
      label: 'Device Name',
      sortable: true,
      render: (val, row) => (
        <button
          className="btn btn-ghost"
          style={{ padding: 0, textAlign: 'left', fontWeight: 600, color: 'var(--color-primary)' }}
          onClick={() => setSelectedDevice(row)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Laptop size={14} color="var(--color-text-secondary)" />
            <div>
              <div>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 400 }}>{row.vendor || 'Unknown'}</div>
            </div>
          </div>
        </button>
      )
    },
    {
      key: 'connection',
      label: 'Connection',
      sortable: true,
      render: (_, row) => (
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {row.vendor === 'Synology' ? 'Ethernet (eth0)' : 'Wi-Fi 5GHz'}
        </span>
      )
    },
    {
      key: 'online',
      label: 'Status',
      sortable: true,
      render: (online, row) => (
        row.blocked ? (
          <StatusBadge status="blocked" label="Paused" />
        ) : (
          <StatusBadge status={online ? 'connected' : 'offline'} />
        )
      )
    },
    {
      key: 'ip',
      label: 'IP Address',
      mono: true,
      sortable: true
    },
    {
      key: 'usage',
      label: 'Data Usage',
      sortable: true,
      render: (_, row) => (
        <span className="mono" style={{ fontSize: 12 }}>
          {formatBytes((row.rx || 0) + (row.tx || 0))}
        </span>
      )
    },
    {
      key: '_actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedDevice(row)}
            title="View Details"
          >
            Details
          </button>
          <button
            className={`btn ${row.blocked ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => toggleBlock(row.mac)}
            title={row.blocked ? 'Resume Internet' : 'Pause Internet'}
          >
            {row.blocked ? <Play size={12} /> : <Pause size={12} />}
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
        subtitle="Manage devices on the local wireless and Ethernet network"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Total: <strong>{devices.length}</strong> (Online: <strong>{devices.filter(d => d.online).length}</strong>)
            </span>
            <Link to="/advanced/qos" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
              Advanced QoS Bandwidth Limits
              <ArrowRight size={12} />
            </Link>
          </div>
        }
      />

      <div className="card">
        <DataTable
          columns={columns}
          rows={devices}
          searchable={true}
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
