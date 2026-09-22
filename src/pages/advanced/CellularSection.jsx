import { useState } from 'react'
import { Radio, Save, RefreshCw, Check } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import useSignalStore from '../../store/useSignalStore.js'
import { mockModem } from '../../lib/mockData.js'

export default function CellularSection() {
  const signal = useSignalStore(s => s.current)
  const fetchSignal = useSignalStore(s => s.fetch)

  const [apnConfig, setApnConfig] = useState({
    apn: mockModem.apn || 'airtelgprs.com',
    authType: 'PAP/CHAP',
    username: '',
    password: '',
    networkMode: 'Auto (LTE / WCDMA)'
  })
  const [saved, setSaved] = useState(false)

  const handleSaveApn = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      {/* ── Cellular Radio & Signal Metrics ─────────────────────── */}
      <SectionCard
        title="Cellular RF Signal & Telemetry"
        subtitle="Low-level physical layer cellular metrics from modem"
        badge={<StatusBadge status={signal.connected ? 'connected' : 'disconnected'} />}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={fetchSignal}>
            <RefreshCw size={12} />
            Refresh Telemetry
          </button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div className="info-block">
            <div className="info-block-label">RSRP</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {signal.rsrp} dBm
            </div>
            <div className="info-block-sub">Reference Signal Received Power</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">RSRQ</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {signal.rsrq} dB
            </div>
            <div className="info-block-sub">Reference Signal Received Quality</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">SINR</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {signal.sinr} dB
            </div>
            <div className="info-block-sub">Signal to Interference & Noise</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">RSSI</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {signal.rssi} dBm
            </div>
            <div className="info-block-sub">Received Signal Strength Indicator</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">LTE Band & Freq</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {signal.band} ({signal.frequency || '1800 MHz'})
            </div>
            <div className="info-block-sub">EARFCN: 1300</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Cell ID & TAC</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              0x4A2F (18991)
            </div>
            <div className="info-block-sub">TAC: 0x24C1 (9409)</div>
          </div>
        </div>
      </SectionCard>

      {/* ── SIM Card & Modem Information ────────────────────────── */}
      <SectionCard
        title="Modem Hardware & SIM Status"
        subtitle="Embedded Quectel cellular modem hardware parameters"
      >
        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
          {[
            ['Modem Model', mockModem.model || 'Quectel EC25-E Mini PCIe'],
            ['Modem Firmware', 'EC25EFAR06A03M4G_OCPU'],
            ['IMEI', mockModem.imei || '359072061070587'],
            ['SIM Status', 'Ready / Unlocked'],
            ['ICCID (SIM Serial)', mockModem.iccid || '8991101200003204520'],
            ['Registered Operator', `${signal.operator || 'Airtel'} (MCC: ${mockModem.mcc || '404'}, MNC: ${mockModem.mnc || '10'})`],
            ['Registration State', 'Registered, Home Network (5)'],
          ].map(([k, v], idx) => (
            <div
              key={k}
              style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 12px',
                fontSize: 12,
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                borderBottom: idx === 6 ? 'none' : '1px solid var(--color-border-subtle)'
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
              <span className="mono" style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── APN & Cellular Connection Profile ───────────────────── */}
      <SectionCard
        title="APN & Connection Profile"
        subtitle="Access Point Name profile and network selection mode"
        configureLabel="Edit APN Profile"
        configureContent={
          <form onSubmit={handleSaveApn}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">APN Name</label>
                <input
                  className="form-input mono"
                  value={apnConfig.apn}
                  onChange={e => setApnConfig({ ...apnConfig, apn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Authentication Type</label>
                <select
                  className="form-select"
                  value={apnConfig.authType}
                  onChange={e => setApnConfig({ ...apnConfig, authType: e.target.value })}
                >
                  <option value="NONE">None</option>
                  <option value="PAP">PAP</option>
                  <option value="CHAP">CHAP</option>
                  <option value="PAP/CHAP">PAP / CHAP (Automatic)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Network Mode Preference</label>
                <select
                  className="form-select"
                  value={apnConfig.networkMode}
                  onChange={e => setApnConfig({ ...apnConfig, networkMode: e.target.value })}
                >
                  <option value="Auto (LTE / WCDMA)">Auto (LTE / WCDMA / GSM)</option>
                  <option value="LTE Only">LTE Only (4G Forced)</option>
                  <option value="WCDMA Only">3G WCDMA Only</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={12} />
                Save & Apply APN
              </button>
              {saved && (
                <span style={{ fontSize: 12, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} />
                  APN settings applied to modem interface.
                </span>
              )}
            </div>
          </form>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div className="info-block">
            <div className="info-block-label">Active APN</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{apnConfig.apn}</div>
            <div className="info-block-sub">Protocol: IPv4/IPv6 Dual</div>
          </div>
          <div className="info-block">
            <div className="info-block-label">Network Mode</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{apnConfig.networkMode}</div>
            <div className="info-block-sub">Band search: Automatic</div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
