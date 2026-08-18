import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import ConfirmModal from '../../components/common/ConfirmModal.jsx'
import { mockSystem, mockModem } from '../../lib/mockData.js'
import { Settings, Save, RefreshCw, Power, AlertTriangle } from 'lucide-react'

export default function AdminSettings() {
  const [hostname, setHostname] = useState(mockSystem.hostname)
  const [confirm, setConfirm]   = useState(null)
  const [saved,   setSaved]     = useState('')
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })

  const save = (field) => { setSaved(field); setTimeout(() => setSaved(''), 2000) }

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Device configuration and system management" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Device info */}
        <div className="card">
          <div className="card-header"><span className="card-title">Device Info</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            {[
              ['Model',     mockSystem.model],
              ['Kernel',    mockSystem.kernel],
              ['Firmware',  mockSystem.firmware],
              ['Modem',     mockModem.model],
              ['IMEI',      mockModem.imei],
              ['ICCID',     mockModem.iccid],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                <span className="mono" style={{ fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hostname */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><span className="card-title">Hostname</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="sl-field">
                <label className="sl-label">Device Hostname</label>
                <input className="sl-input mono" value={hostname} onChange={e => setHostname(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={() => save('hostname')}><Save size={13} />Save</button>
                {saved === 'hostname' && <span style={{ color: 'var(--color-success)', fontSize: 12 }}>✓ Saved</span>}
              </div>
            </div>
          </div>

          {/* Admin password */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><span className="card-title">Admin Password</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['current', 'next', 'confirm'].map(f => (
                <div key={f} className="sl-field">
                  <label className="sl-label">{f === 'current' ? 'Current Password' : f === 'next' ? 'New Password' : 'Confirm New Password'}</label>
                  <input className="sl-input" type="password" value={password[f]} onChange={e => setPassword(p => ({ ...p, [f]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={() => save('pass')}><Save size={13} />Change Password</button>
                {saved === 'pass' && <span style={{ color: 'var(--color-success)', fontSize: 12 }}>✓ Changed</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System actions */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><span className="card-title">System Actions</span><AlertTriangle size={14} color="var(--color-warning)" /></div>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setConfirm('reboot')}><RefreshCw size={14} />Reboot Device</button>
          <button className="btn btn-danger"    onClick={() => setConfirm('shutdown')}><Power size={14} />Shutdown Device</button>
        </div>
      </div>

      {confirm === 'reboot' && (
        <ConfirmModal
          title="Reboot Device"
          message="The Raspberry Pi will restart. All connected clients will lose internet access for ~60 seconds."
          confirmLabel="Reboot"
          variant="warning"
          onConfirm={() => {}}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'shutdown' && (
        <ConfirmModal
          title="Shutdown Device"
          message="The Raspberry Pi will power off. You will need physical access to turn it back on."
          confirmLabel="Shutdown"
          variant="danger"
          onConfirm={() => {}}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
