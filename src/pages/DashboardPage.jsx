import { Link } from 'react-router-dom'
import {
  Globe,
  Radio,
  BarChart2,
  Laptop,
  Activity,
  Cpu,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import AlertBanner from '../components/common/AlertBanner.jsx'
import useSignalStore from '../store/useSignalStore.js'
import useTrafficStore from '../store/useTrafficStore.js'
import useSystemStore from '../store/useSystemStore.js'
import useDeviceStore from '../store/useDeviceStore.js'
import { formatRate, formatUptime, signalQuality, formatBytes } from '../lib/utils.js'
import { mockMonthlyUsage } from '../lib/mockData.js'

export default function DashboardPage() {
  const signal  = useSignalStore(s => s.current)
  const live    = useTrafficStore(s => s.live)
  const system  = useSystemStore(s => s.status)
  const devices = useDeviceStore(s => s.devices)

  const sigQuality = signalQuality(signal.rssi)
  const onlineDevices = devices.filter(d => d.online)

  // Device type breakdown
  const deviceBreakdown = {
    phones: devices.filter(d => /phone|iphone|android/i.test(d.name + d.hostname)).length,
    laptops: devices.filter(d => /macbook|laptop|pc|desktop/i.test(d.name + d.hostname)).length,
    iot: devices.filter(d => /tv|nas|camera|smart/i.test(d.name + d.hostname)).length,
    other: 0
  }
  deviceBreakdown.other = Math.max(0, devices.length - (deviceBreakdown.phones + deviceBreakdown.laptops + deviceBreakdown.iot))

  // Storage estimation
  const storageTotal = 32 // GB (Raspberry Pi MicroSD/eMMC)
  const storageUsed = 14.2

  // Determine Alerts based on real device metrics
  const alerts = []
  if (!signal.connected) {
    alerts.push({ type: 'danger', message: 'Internet connection is offline. Check cellular SIM or APN configuration.' })
  } else if (signal.rssi < -90) {
    alerts.push({ type: 'warning', message: 'Cellular signal is weak. Reposition device or antenna for improved throughput.' })
  } else if (system.cpu > 85) {
    alerts.push({ type: 'warning', message: 'High CPU utilization detected.' })
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Dashboard"
        subtitle="Network status overview and connection telemetry"
      />

      {/* Block F: Alerts */}
      {alerts.length > 0 ? (
        alerts.map((alt, i) => (
          <AlertBanner key={i} type={alt.type} message={alt.message} />
        ))
      ) : (
        <AlertBanner
          type="success"
          message="No issues detected. All network and routing services are operating normally."
        />
      )}

      {/* Primary Dashboard Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>

        {/* ── Block A: Internet Connection ────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={15} color="var(--color-primary)" />
              <span className="card-title">Internet Connection</span>
            </div>
            <StatusBadge status={signal.connected ? 'connected' : 'disconnected'} />
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="info-block">
                <div className="info-block-label">Network Type</div>
                <div className="info-block-value" style={{ fontSize: 16 }}>
                  {signal.technology || '4G LTE'}
                </div>
                <div className="info-block-sub">{signal.operator || 'Mobile Operator'}</div>
              </div>

              <div className="info-block">
                <div className="info-block-label">Signal Quality</div>
                <div className="info-block-value" style={{ fontSize: 16, color: sigQuality.color === 'text-danger' ? 'var(--color-danger)' : sigQuality.color === 'text-warning' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                  {sigQuality.label}
                </div>
                <div className="info-block-sub">Band {signal.band || 'Auto'}</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/advanced/cellular" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
                Cellular parameters in Advanced Settings
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Block D: Current Network Speeds ─────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={15} color="var(--color-primary)" />
              <span className="card-title">Current Network Speed</span>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Live · 2s</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="info-block">
                <div className="info-block-label">Download</div>
                <div className="info-block-value mono" style={{ fontSize: 16, color: 'var(--color-primary)' }}>
                  {formatRate(live.rxRate)}
                </div>
                <div className="info-block-sub">Incoming rate</div>
              </div>

              <div className="info-block">
                <div className="info-block-label">Upload</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>
                  {formatRate(live.txRate)}
                </div>
                <div className="info-block-sub">Outgoing rate</div>
              </div>

              <div className="info-block">
                <div className="info-block-label">Latency</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>
                  28 ms
                </div>
                <div className="info-block-sub">Ping to DNS</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Block B: Data Usage ─────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={15} color="var(--color-primary)" />
              <span className="card-title">Data Usage</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Current Billing Cycle</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
                <div className="info-block-value mono" style={{ fontSize: 16 }}>
                  {mockMonthlyUsage.current.rx + mockMonthlyUsage.current.tx} GB
                </div>
                <div className="info-block-sub">Limit: 150 GB (58% used)</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Block C: Connected Devices ──────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Laptop size={15} color="var(--color-primary)" />
              <span className="card-title">Connected Devices</span>
            </div>
            <StatusBadge status="online" label={`${onlineDevices.length} Online`} />
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
              <div className="info-block" style={{ padding: '8px 4px' }}>
                <div className="info-block-label" style={{ fontSize: 10 }}>Phones</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>{deviceBreakdown.phones}</div>
              </div>
              <div className="info-block" style={{ padding: '8px 4px' }}>
                <div className="info-block-label" style={{ fontSize: 10 }}>Laptops</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>{deviceBreakdown.laptops}</div>
              </div>
              <div className="info-block" style={{ padding: '8px 4px' }}>
                <div className="info-block-label" style={{ fontSize: 10 }}>Smart / IoT</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>{deviceBreakdown.iot}</div>
              </div>
              <div className="info-block" style={{ padding: '8px 4px' }}>
                <div className="info-block-label" style={{ fontSize: 10 }}>Other</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>{deviceBreakdown.other}</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/devices" className="btn btn-secondary btn-sm">
                View devices
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Block E: System Status ──────────────────────────────── */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={15} color="var(--color-primary)" />
              <span className="card-title">System Status</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {system.model || 'Raspberry Pi'} · {system.hostname || 'netsense-gw'}
            </span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div className="info-block">
                <div className="info-block-label">CPU Load</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>{system.cpu}%</div>
                <div className="info-block-sub">{system.cpuCores || 4} Cores @ {system.temp}°C</div>
              </div>

              <div className="info-block">
                <div className="info-block-label">Memory</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>
                  {system.memUsed} / {system.memTotal} GB
                </div>
                <div className="info-block-sub">{Math.round((system.memUsed / system.memTotal) * 100)}% utilized</div>
              </div>

              <div className="info-block">
                <div className="info-block-label">Storage</div>
                <div className="info-block-value mono" style={{ fontSize: 16 }}>
                  {storageUsed} / {storageTotal} GB
                </div>
                <div className="info-block-sub">eMMC / MicroSD</div>
              </div>

              <div className="info-block">
                <div className="info-block-label">System Uptime</div>
                <div className="info-block-value mono" style={{ fontSize: 15 }}>
                  {formatUptime(system.uptimeSeconds)}
                </div>
                <div className="info-block-sub">Kernel {system.kernel || 'Linux'}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
