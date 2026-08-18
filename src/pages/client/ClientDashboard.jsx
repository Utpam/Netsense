import MetricCard from '../../components/common/MetricCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import BandwidthChart from '../../components/traffic/BandwidthChart.jsx'
import SignalGauge from '../../components/signal/SignalGauge.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import useSignalStore from '../../store/useSignalStore.js'
import useTrafficStore from '../../store/useTrafficStore.js'
import useDeviceStore from '../../store/useDeviceStore.js'
import { formatRate, formatBytes } from '../../lib/utils.js'
import { mockSystem, mockMonthlyUsage } from '../../lib/mockData.js'
import { Wifi, Download, Upload, Users } from 'lucide-react'

export default function ClientDashboard() {
  const signal   = useSignalStore(s => s.current)
  const history  = useTrafficStore(s => s.history)
  const live     = useTrafficStore(s => s.live)
  const devices  = useDeviceStore(s => s.devices)
  const online   = devices.filter(d => d.online).length

  return (
    <div>
      <PageHeader title="Network Status" subtitle="Your SkyLink connection overview" />

      {/* Connection status banner */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, borderLeft: '3px solid var(--color-success)' }}>
        <span className="live-dot" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Internet Connected</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {signal.operator} · {signal.technology} · {signal.band} · WAN IP: {mockSystem.wanIp}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge status="connected" dot />
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Download Speed"  value={formatRate(live.rxRate)} icon={Download} accentColor="var(--color-primary)" />
        <MetricCard label="Upload Speed"    value={formatRate(live.txRate)} icon={Upload}   accentColor="var(--color-info)" />
        <MetricCard label="Signal Strength" value={signal.rssi} unit="dBm" icon={Wifi} />
        <MetricCard label="Devices Online"  value={online}                  icon={Users} />
        <MetricCard label="This Month DL"   value={`${mockMonthlyUsage.current.rx} GB`} />
        <MetricCard label="This Month UL"   value={`${mockMonthlyUsage.current.tx} GB`} />
      </div>

      {/* Chart + Signal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 12 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Live Bandwidth</span>
            <span className="live-dot" />
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <BandwidthChart data={history} height={150} />
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Signal</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <SignalGauge rssi={signal.rssi} size={0.85} />
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              {signal.operator}<br />{signal.technology} · {signal.band}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
