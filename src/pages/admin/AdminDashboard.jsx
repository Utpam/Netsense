import { Cpu, Thermometer, MemoryStick, Globe, Users, Activity, Radio, Wifi } from 'lucide-react'
import MetricCard from '../../components/common/MetricCard.jsx'
import BandwidthChart from '../../components/traffic/BandwidthChart.jsx'
import SignalGauge from '../../components/signal/SignalGauge.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import useSystemStore from '../../store/useSystemStore.js'
import useSignalStore from '../../store/useSignalStore.js'
import useTrafficStore from '../../store/useTrafficStore.js'
import useDeviceStore from '../../store/useDeviceStore.js'
import { formatBytes, formatUptime, formatRate } from '../../lib/utils.js'
import { mockDnsStatus, mockVpnStatus } from '../../lib/mockData.js'

export default function AdminDashboard() {
  const sys     = useSystemStore(s => s.status)
  const signal  = useSignalStore(s => s.current)
  const history = useTrafficStore(s => s.history)
  const live    = useTrafficStore(s => s.live)
  const devices = useDeviceStore(s => s.devices)

  const onlineCount  = devices.filter(d => d.online).length
  const blockedCount = devices.filter(d => d.blocked).length
  const memPct       = Math.round((sys.memUsed / sys.memTotal) * 100)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`${sys.hostname} · ${sys.model} · SkyLink OS 1.0.0`}
      />

      {/* Key metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard
          label="CPU Usage"
          value={sys.cpu}
          unit="%"
          icon={Cpu}
          accentColor={sys.cpu > 80 ? 'var(--color-danger)' : sys.cpu > 60 ? 'var(--color-warning)' : undefined}
        />
        <MetricCard
          label="Temperature"
          value={sys.temp}
          unit="°C"
          icon={Thermometer}
          accentColor={sys.temp > 70 ? 'var(--color-danger)' : sys.temp > 60 ? 'var(--color-warning)' : undefined}
        />
        <MetricCard
          label="Memory"
          value={memPct}
          unit="%"
          icon={MemoryStick}
        >
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {sys.memUsed} / {sys.memTotal} GB
          </div>
          <div style={{ height: 3, background: 'var(--color-surface-4)', borderRadius: 2, marginTop: 6 }}>
            <div style={{ width: `${memPct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.5s' }} />
          </div>
        </MetricCard>
        <MetricCard label="Uptime" value={formatUptime(sys.uptimeSeconds)} icon={Cpu} />
        <MetricCard label="Devices Online" value={onlineCount} unit={`/ ${devices.length}`} icon={Users} />
        <MetricCard label="Download" value={formatRate(live.rxRate)} icon={Activity} accentColor="var(--color-primary)" />
        <MetricCard label="Upload"   value={formatRate(live.txRate)} icon={Activity} accentColor="var(--color-info)" />
        <MetricCard label="WAN IP"   value={sys.wanIp} icon={Globe} />
      </div>

      {/* Charts + Signal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Live Bandwidth</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Live · 2 s</span>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <BandwidthChart data={history} height={160} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Signal</span>
            <StatusBadge status={signal.connected ? 'connected' : 'disconnected'} />
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <SignalGauge rssi={signal.rssi} />
            <div style={{ width: '100%', fontSize: 11 }}>
              {[
                ['Operator', signal.operator],
                ['Tech',     signal.technology],
                ['Band',     signal.band],
                ['SINR',     `${signal.sinr} dB`],
                ['RSRP',     `${signal.rsrp} dBm`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                  <span className="mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services status */}
      <div className="card">
        <div className="card-header"><span className="card-title">Services</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 0 }}>
          {[
            { label: 'DNS Cache',      icon: Globe,     status: mockDnsStatus.running ? 'active' : 'inactive', detail: `${mockDnsStatus.cacheEntries} entries · ${Math.round(mockDnsStatus.hitRate * 100)}% hit` },
            { label: 'VPN (WireGuard)',icon: Wifi,      status: mockVpnStatus.status === 'up' ? 'active' : 'inactive',   detail: `wg0 · ${mockVpnStatus.peers} peers` },
            { label: 'File Server',    icon: Radio,     status: 'active', detail: '3 shares active' },
            { label: 'QoS Engine',     icon: Activity,  status: 'active', detail: 'HTB · 5 rules' },
          ].map(svc => (
            <div key={svc.label} style={{ padding: '12px 16px', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <svc.icon size={16} color="var(--color-text-muted)" />
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{svc.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{svc.detail}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <StatusBadge status={svc.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
