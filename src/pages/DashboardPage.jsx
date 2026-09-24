import { Link } from 'react-router-dom'
import {
  Globe, BarChart2, Laptop, Activity, Cpu, ArrowRight
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import AlertBanner from '../components/common/AlertBanner.jsx'
import useSignalStore from '../store/useSignalStore.js'
import useTrafficStore from '../store/useTrafficStore.js'
import useSystemStore from '../store/useSystemStore.js'
import useDeviceStore from '../store/useDeviceStore.js'
import { formatRate, formatUptime, signalQuality } from '../lib/utils.js'
import { mockMonthlyUsage } from '../lib/mockData.js'

export default function DashboardPage() {
  const signal  = useSignalStore(s => s.current)
  const live    = useTrafficStore(s => s.live)
  const system  = useSystemStore(s => s.status)
  const devices = useDeviceStore(s => s.devices)

  const sigQuality   = signalQuality(signal.rssi)
  const onlineDevices = devices.filter(d => d.online)

  const deviceBreakdown = {
    phones:  devices.filter(d => /phone|iphone|android/i.test(d.name + d.hostname)).length,
    laptops: devices.filter(d => /macbook|laptop|pc|desktop/i.test(d.name + d.hostname)).length,
    iot:     devices.filter(d => /tv|nas|camera|smart/i.test(d.name + d.hostname)).length,
  }
  deviceBreakdown.other = Math.max(
    0,
    devices.length - (deviceBreakdown.phones + deviceBreakdown.laptops + deviceBreakdown.iot)
  )

  const storageTotal = 32
  const storageUsed  = 14.2

  const alerts = []
  if (!signal.connected) {
    alerts.push({ type: 'danger', message: 'Internet connection is offline. Check cellular SIM or APN configuration.' })
  } else if (signal.rssi < -90) {
    alerts.push({ type: 'warning', message: 'Cellular signal is weak. Reposition the device or antenna for better throughput.' })
  } else if (system.cpu > 85) {
    alerts.push({ type: 'warning', message: 'High CPU utilization detected.' })
  }

  const sigColor =
    sigQuality.color === 'text-danger'  ? 'var(--color-danger)'  :
    sigQuality.color === 'text-warning' ? 'var(--color-warning)' :
    'var(--color-success)'

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Network status overview and connection telemetry"
      />

      {/* Alerts */}
      {alerts.length > 0
        ? alerts.map((a, i) => <AlertBanner key={i} type={a.type} message={a.message} />)
        : <AlertBanner type="success" message="No issues detected. All network services are operating normally." />
      }

      {/* Main card grid — auto-fit collapses on narrow screens */}
      <div className="grid-auto-lg" style={{ marginBottom: 14 }}>

        {/* Block A — Internet Connection */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Globe size={14} color="var(--color-primary)" />
              <span className="card-title">Internet Connection</span>
            </div>
            <StatusBadge status={signal.connected ? 'connected' : 'disconnected'} />
          </div>
          <div className="card-body">
            <div className="grid-2col">
              <div className="info-block">
                <div className="info-block-label">Network Type</div>
                <div className="info-block-value" style={{ fontSize: 15 }}>
                  {signal.technology || '4G LTE'}
                </div>
                <div className="info-block-sub">{signal.operator || 'Mobile Operator'}</div>
              </div>
              <div className="info-block">
                <div className="info-block-label">Signal Quality</div>
                <div className="info-block-value" style={{ fontSize: 15, color: sigColor }}>
                  {sigQuality.label}
                </div>
                <div className="info-block-sub">Band {signal.band || 'Auto'}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/advanced/cellular" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
                Cellular parameters
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* Block D — Current Network Speed */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Activity size={14} color="var(--color-primary)" />
              <span className="card-title">Current Network Speed</span>
            </div>
            <span className="mono" style={{ fontSize: 10, color: 'var(--color-text-secondary)', flexShrink: 0 }}>Live · 2s</span>
          </div>
          <div className="card-body">
            <div className="grid-3col">
              <div className="info-block">
                <div className="info-block-label">Download</div>
                <div className="info-block-value mono" style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                  {formatRate(live.rxRate)}
                </div>
                <div className="info-block-sub">Incoming</div>
              </div>
              <div className="info-block">
                <div className="info-block-label">Upload</div>
                <div className="info-block-value mono" style={{ fontSize: 14 }}>
                  {formatRate(live.txRate)}
                </div>
                <div className="info-block-sub">Outgoing</div>
              </div>
              <div className="info-block">
                <div className="info-block-label">Latency</div>
                <div className="info-block-value mono" style={{ fontSize: 14 }}>28 ms</div>
                <div className="info-block-sub">Ping DNS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Block B — Data Usage */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <BarChart2 size={14} color="var(--color-primary)" />
              <span className="card-title">Data Usage</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--color-text-secondary)', flexShrink: 0 }}>Billing Cycle</span>
          </div>
          <div className="card-body">
            <div className="grid-2col">
              <div className="info-block">
                <div className="info-block-label">Today's Usage</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Download:</span>
                    <strong className="mono">1.42 GB</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Upload:</span>
                    <strong className="mono">318 MB</strong>
                  </div>
                </div>
              </div>
              <div className="info-block">
                <div className="info-block-label">Monthly Total</div>
                <div className="info-block-value mono" style={{ fontSize: 15 }}>
                  {mockMonthlyUsage.current.rx + mockMonthlyUsage.current.tx} GB
                </div>
                <div className="info-block-sub">Limit: 150 GB (58% used)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Block C — Connected Devices */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Laptop size={14} color="var(--color-primary)" />
              <span className="card-title">Connected Devices</span>
            </div>
            <StatusBadge status="online" label={`${onlineDevices.length} Online`} />
          </div>
          <div className="card-body">
            {/* 4-count grid that wraps gracefully */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
              {[
                ['Phones',    deviceBreakdown.phones],
                ['Laptops',   deviceBreakdown.laptops],
                ['Smart/IoT', deviceBreakdown.iot],
                ['Other',     deviceBreakdown.other],
              ].map(([label, val]) => (
                <div key={label} className="info-block" style={{ padding: '8px 4px' }}>
                  <div className="info-block-label" style={{ fontSize: 9 }}>{label}</div>
                  <div className="info-block-value mono" style={{ fontSize: 16 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/devices" className="btn btn-secondary btn-sm">
                View devices <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Block E — System Status — full-width */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Cpu size={14} color="var(--color-primary)" />
            <span className="card-title">System Status</span>
          </div>
          <span className="text-truncate" style={{ fontSize: 10, color: 'var(--color-text-secondary)', maxWidth: 200 }}>
            {system.model || 'Raspberry Pi'} · {system.hostname || 'netsense-gw'}
          </span>
        </div>
        <div className="card-body">
          <div className="grid-auto-sm">
            <div className="info-block">
              <div className="info-block-label">CPU Load</div>
              <div className="info-block-value mono" style={{ fontSize: 15 }}>{system.cpu}%</div>
              <div className="info-block-sub">{system.cpuCores || 4} Cores @ {system.temp}°C</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Memory</div>
              <div className="info-block-value mono" style={{ fontSize: 15 }}>
                {system.memUsed}&nbsp;/&nbsp;{system.memTotal} GB
              </div>
              <div className="info-block-sub">{Math.round((system.memUsed / system.memTotal) * 100)}% utilized</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Storage</div>
              <div className="info-block-value mono" style={{ fontSize: 15 }}>
                {storageUsed}&nbsp;/&nbsp;{storageTotal} GB
              </div>
              <div className="info-block-sub">eMMC / MicroSD</div>
            </div>
            <div className="info-block">
              <div className="info-block-label">Uptime</div>
              <div className="info-block-value mono" style={{ fontSize: 14 }}>
                {formatUptime(system.uptimeSeconds)}
              </div>
              <div className="info-block-sub">Kernel {system.kernel || 'Linux'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
