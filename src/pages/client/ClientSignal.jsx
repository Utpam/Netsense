import SignalGauge from '../../components/signal/SignalGauge.jsx'
import SignalChart from '../../components/signal/SignalChart.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import useSignalStore from '../../store/useSignalStore.js'
import { signalQuality } from '../../lib/utils.js'
import { mockModem } from '../../lib/mockData.js'

export default function ClientSignal() {
  const signal  = useSignalStore(s => s.current)
  const history = useSignalStore(s => s.history)
  const q       = signalQuality(signal.rssi)

  const metrics = [
    ['RSSI',     `${signal.rssi} dBm`,  'Received Signal Strength Indicator'],
    ['RSRP',     `${signal.rsrp} dBm`,  'Reference Signal Received Power'],
    ['RSRQ',     `${signal.rsrq} dB`,   'Reference Signal Received Quality'],
    ['SINR',     `${signal.sinr} dB`,   'Signal-to-Interference-plus-Noise Ratio'],
    ['Band',     signal.band,            'LTE Frequency Band'],
    ['Tech',     signal.technology,      'Radio Access Technology'],
    ['Operator', signal.operator,        'Network Operator'],
    ['APN',      mockModem.apn,          'Access Point Name'],
  ]

  return (
    <div>
      <PageHeader title="Signal Quality" subtitle="Cellular signal metrics from your SkyLink modem" />

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, marginBottom: 16 }}>
        {/* Gauge */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Signal Strength</span>
            <StatusBadge status={q.label.toLowerCase()} />
          </div>
          <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
            <SignalGauge rssi={signal.rssi} size={0.95} />
          </div>
        </div>

        {/* Metrics */}
        <div className="card">
          <div className="card-header"><span className="card-title">Modem Metrics</span></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {metrics.map(([k, v, desc]) => (
                <div key={k} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>{k}</div>
                  <div className="mono" style={{ fontWeight: 600, fontSize: 15 }}>{v}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signal history */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Signal History (RSSI · dBm)</span>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ color: 'var(--color-success)' }}>■ Excellent (&gt;−70)</span>
            <span style={{ color: 'var(--color-warning)' }}>■ Fair (&gt;−85)</span>
            <span style={{ color: 'var(--color-danger)'  }}>■ Poor (&lt;−85)</span>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <SignalChart data={history} height={150} />
        </div>
      </div>
    </div>
  )
}
