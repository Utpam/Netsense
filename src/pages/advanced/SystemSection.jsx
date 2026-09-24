import { useState } from 'react'
import {
  Cpu,
  Save,
  RotateCcw,
  Power,
  Download,
  Upload,
  Key,
  Check,
  AlertTriangle
} from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import useSystemStore from '../../store/useSystemStore.js'
import { mockModem } from '../../lib/mockData.js'

export default function SystemSection() {
  const system = useSystemStore(s => s.status)

  const [hostname, setHostname] = useState(system.hostname || 'netsense-01')
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [confirmModal, setConfirmModal] = useState(null)
  const [savedNotice, setSavedNotice]   = useState('')

  const handleSaveHostname = (e) => {
    e.preventDefault()
    setSavedNotice('Hostname updated successfully.')
    setTimeout(() => setSavedNotice(''), 2500)
  }

  const handleSavePassword = (e) => {
    e.preventDefault()
    if (password.next !== password.confirm) {
      alert('New passwords do not match!')
      return
    }
    setPassword({ current: '', next: '', confirm: '' })
    setSavedNotice('Administrator password changed.')
    setTimeout(() => setSavedNotice(''), 2500)
  }

  const handleBackupExport = () => {
    const configData = {
      app: 'NetSense',
      version: '2.4.0-rpi',
      exportedAt: new Date().toISOString(),
      hostname,
      network: { lanIp: system.lanIp, wanIp: system.wanIp }
    }
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `netsense-config-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleRestoreImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSavedNotice(`Restored configuration from ${file.name}`)
      setTimeout(() => setSavedNotice(''), 3000)
      e.target.value = ''
    }
  }

  return (
    <div>
      {/* ── System Information ──────────────────────────────────── */}
      <SectionCard
        title="Hardware & Firmware Specifications"
        subtitle="Host platform architecture and operating system build"
      >
        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
          {[
            ['Hardware Platform', system.model || 'Raspberry Pi 5 Model B (8GB RAM)'],
            ['SoC / CPU', 'Broadcom BCM2712 (Quad-core Cortex-A76 @ 2.4GHz)'],
            ['Operating System', 'NetSense OS 2.4.0 (Debian 12 Bookworm based)'],
            ['Linux Kernel', system.kernel || '6.6.31+rpt-rpi-2712 aarch64'],
            ['Cellular Modem', mockModem.model || 'Quectel EC25-E Mini PCIe'],
            ['Firmware Build', '2026.09-STABLE-rpi5'],
          ].map(([k, v], idx) => (
            <div
              key={k}
              className="kv-row"
              style={{
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                borderBottom: idx === 5 ? 'none' : '1px solid var(--color-border-subtle)'
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }}>{k}</span>
              <span className="mono" style={{ fontWeight: 500, wordBreak: 'break-all', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Device Hostname & Administration ────────────────────── */}
      <SectionCard
        title="Host Identity & Admin Credentials"
        subtitle="Network hostname and web UI administrator login"
      >
        <div className="grid-2col">
          {/* Hostname form */}
          <form onSubmit={handleSaveHostname}>
            <div className="form-group">
              <label className="form-label">Device Hostname</label>
              <input
                className="form-input mono"
                value={hostname}
                onChange={e => setHostname(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              <Save size={12} />
              Save Hostname
            </button>
          </form>

          {/* Admin password change */}
          <form onSubmit={handleSavePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={password.current}
                onChange={e => setPassword({ ...password, current: e.target.value })}
                required
              />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password.next}
                  onChange={e => setPassword({ ...password, next: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password.confirm}
                  onChange={e => setPassword({ ...password, confirm: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              <Key size={12} />
              Change Password
            </button>
          </form>
        </div>

        {savedNotice && (
          <div className="alert-box alert-success" style={{ marginTop: 12 }}>
            <Check size={14} color="var(--color-success)" />
            <span>{savedNotice}</span>
          </div>
        )}
      </SectionCard>

      {/* ── Configuration Backup & Restore ──────────────────────── */}
      <SectionCard
        title="Backup & Restore Settings"
        subtitle="Export router configuration or restore from a JSON backup file"
      >
        <div className="btn-row">
          <button className="btn btn-secondary btn-sm" onClick={handleBackupExport}>
            <Download size={13} />
            Export Configuration Backup (.json)
          </button>

          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={13} />
            Restore Configuration File
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleRestoreImport}
            />
          </label>
        </div>
      </SectionCard>

      {/* ── Power & Reboot Controls ─────────────────────────────── */}
      <SectionCard
        title="System Power Operations"
        subtitle="Safe reboot and shutdown operations with confirmation verification"
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setConfirmModal('reboot')}>
            <RotateCcw size={13} />
            Reboot Device
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setConfirmModal('shutdown')}>
            <Power size={13} />
            Shutdown Device
          </button>
        </div>
      </SectionCard>

      {/* Confirmation Modals for dangerous actions */}
      {confirmModal === 'reboot' && (
        <ConfirmModal
          title="Reboot NetSense Device"
          message="The Raspberry Pi router will restart. All active client sessions will lose network connectivity for approximately 45-60 seconds."
          confirmLabel="Reboot Now"
          variant="warning"
          onConfirm={() => {
            alert('Reboot sequence initiated.')
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {confirmModal === 'shutdown' && (
        <ConfirmModal
          title="Shutdown NetSense Gateway"
          message="The system will safely unmount filesystems and power off. You will need physical access to reconnect power to restart the device."
          confirmLabel="Power Off"
          variant="danger"
          onConfirm={() => {
            alert('Power down sequence initiated.')
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  )
}
