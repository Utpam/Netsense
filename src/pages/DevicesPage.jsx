import { useState } from 'react'
import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import DeviceDetailModal from '../components/common/DeviceDetailModal.jsx'
import HotspotStatus from '../components/hotspot/HotspotStatus.jsx'
import ConnectedDeviceCount from '../components/hotspot/ConnectedDeviceCount.jsx'
import ConnectedDevices from '../components/hotspot/ConnectedDevices.jsx'
import RefreshButton from '../components/hotspot/RefreshButton.jsx'
import useHotspot from '../hooks/useHotspot.js'

function formatLastUpdated(date) {
  if (!date) return null
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function DevicesPage() {
  const {
    status,
    devices,
    loading,
    isRefreshing,
    statusError,
    devicesError,
    lastUpdated,
    refresh,
    toggleBlockDevice,
    updateDeviceName,
  } = useHotspot({ interval: 10000, autoPoll: true })

  const [selectedDevice, setSelectedDevice] = useState(null)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* ── Page Header with Manual Refresh & Last Updated ───────── */}
      <PageHeader
        title="Connected Devices"
        subtitle="Wi-Fi hotspot status and connected client device management"
        actions={
          <div className="btn-row" style={{ alignItems: 'center' }}>
            {lastUpdated && (
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Clock size={12} style={{ color: 'var(--color-text-muted)' }} />
                Last updated: <strong>{formatLastUpdated(lastUpdated)}</strong>
              </span>
            )}

            <RefreshButton
              onRefresh={refresh}
              isRefreshing={isRefreshing}
              disabled={loading}
            />

            <Link
              to="/advanced/qos"
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              QoS Limits <ArrowRight size={11} />
            </Link>
          </div>
        }
      />

      {/* ── Hotspot Summary Section ──────────────────────────────── */}
      <div
        className="grid-2col"
        style={{ marginBottom: 16 }}
      >
        {/* Card 1: Hotspot Active / Inactive Status */}
        <HotspotStatus
          status={status}
          loading={loading}
          error={statusError}
          onRetry={refresh}
        />

        {/* Card 2: Connected Devices Count from /api/hotspot/status */}
        <ConnectedDeviceCount
          count={status?.connectedDeviceCount}
          loading={loading}
          error={statusError}
          onRetry={refresh}
        />
      </div>

      {/* ── Connected Device List Section ────────────────────────── */}
      <ConnectedDevices
        devices={devices}
        loading={loading}
        error={devicesError}
        onRetry={refresh}
        onSelectDevice={device => setSelectedDevice(device)}
        onToggleBlock={toggleBlockDevice}
      />

      {/* ── Device Detail Modal ──────────────────────────────────── */}
      {selectedDevice && (
        <DeviceDetailModal
          device={{
            ...selectedDevice,
            name: selectedDevice.deviceName || selectedDevice.name || 'Unknown device',
            ip: selectedDevice.ipAddress || selectedDevice.ip || 'Unknown IP',
            mac: selectedDevice.macAddress || selectedDevice.mac || '—',
          }}
          onClose={() => setSelectedDevice(null)}
          onUpdateDevice={(mac, patch) => {
            if (patch.name) {
              updateDeviceName(mac, patch.name)
            }
            setSelectedDevice(prev => ({ ...prev, ...patch }))
          }}
          onToggleBlock={(mac) => {
            toggleBlockDevice(mac)
            setSelectedDevice(prev => ({ ...prev, blocked: !prev.blocked }))
          }}
        />
      )}
    </div>
  )
}
