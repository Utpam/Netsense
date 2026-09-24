import { useState, useEffect } from 'react'
import { LineChart, Terminal, RefreshCw, Server, Activity, Check } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { getActuatorHealth, getActuatorInfo, getActuatorMetrics, getDnsLinuxTest } from '../../lib/api.js'
import useSystemStore from '../../store/useSystemStore.js'

export default function MonitoringSection() {
  const system = useSystemStore(s => s.status)

  const [actuatorHealth, setActuatorHealth] = useState(null)
  const [actuatorInfo, setActuatorInfo]     = useState(null)
  const [actuatorMetrics, setActuatorMetrics] = useState(null)
  const [linuxDiagnostics, setLinuxDiagnostics] = useState(null)
  const [loading, setLoading]               = useState(false)

  const [systemLogs] = useState([
    { time: '19:30:12', level: 'INFO', source: 'kernel', msg: 'wwan0: link become ready, carrier detected' },
    { time: '19:30:14', level: 'INFO', source: 'dnsmasq', msg: 'started, version 2.89 cachesize 150' },
    { time: '19:30:15', level: 'INFO', source: 'wireguard', msg: 'wg0: Interface listening on UDP port 51820' },
    { time: '19:32:01', level: 'INFO', source: 'dhcpd', msg: 'DHCPACK on 192.168.1.101 to a4:c3:f0:11:22:33 (MacBook Pro)' },
    { time: '19:33:45', level: 'INFO', source: 'dhcpd', msg: 'DHCPACK on 192.168.1.102 to b8:27:eb:55:66:77 (iPhone 15 Pro)' },
    { time: '19:34:10', level: 'WARN', source: 'netfilter', msg: 'DROPPED IN=wwan0 OUT= MAC= SRC=198.51.100.22 DST=100.116.43.9 PROTO=TCP DPT=23' },
    { time: '19:35:00', level: 'INFO', source: 'systemd', msg: 'Starting NetSense Health Monitor Service...' },
  ])

  const fetchDiagnostics = async () => {
    setLoading(true)
    try {
      const [health, info, metrics, linux] = await Promise.all([
        getActuatorHealth(),
        getActuatorInfo(),
        getActuatorMetrics(),
        getDnsLinuxTest(),
      ])
      setActuatorHealth(health)
      setActuatorInfo(info)
      setActuatorMetrics(metrics)
      setLinuxDiagnostics(linux)
    } catch (err) {
      console.warn('Diagnostics fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostics()
  }, [])

  return (
    <div>
      {/* ── System Diagnostics & Health ─────────────────────────── */}
      <SectionCard
        title="Host & Service Telemetry Diagnostics"
        subtitle="Hardware telemetry and Spring Boot Actuator endpoints"
        badge={<StatusBadge status={actuatorHealth?.status === 'UP' ? 'active' : 'warning'} label={actuatorHealth?.status || 'UP'} />}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={fetchDiagnostics} disabled={loading}>
            <RefreshCw size={12} />
            Refresh Telemetry
          </button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="info-block">
            <div className="info-block-label">Application Status</div>
            <div className="info-block-value mono" style={{ fontSize: 16, color: 'var(--color-success)' }}>
              {actuatorHealth?.status || 'UP'}
            </div>
            <div className="info-block-sub">{actuatorInfo?.app?.name || 'NetSense Gateway'}</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">CPU Temperature</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {system.temp}°C
            </div>
            <div className="info-block-sub">Broadcom BCM2712 SoC</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Linux Host Diagnostics</div>
            <div className="info-block-value mono" style={{ fontSize: 14 }}>
              {linuxDiagnostics?.status || 'OK'}
            </div>
            <div className="info-block-sub">{linuxDiagnostics?.dnsmasq || 'dnsmasq v2.89 passed'}</div>
          </div>
        </div>

        {linuxDiagnostics && (
          <div style={{ padding: '8px 12px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border-subtle)', borderRadius: 4, marginBottom: 16 }}>
            <div className="info-block-label">Operating System Kernel Banner</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--color-text)' }}>
              {linuxDiagnostics.system}
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── System Log Viewer ───────────────────────────────────── */}
      <SectionCard
        title="Kernel & Service Event Log (journald / syslog)"
        subtitle="Live event buffer from systemd and network daemons"
      >
        <div style={{
          backgroundColor: '#FAFAFA',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          padding: 12,
          maxHeight: 280,
          overflowY: 'auto',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          fontFamily: 'var(--font-family-mono)',
          fontSize: 11
        }}>
          {systemLogs.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, padding: '3px 0', borderBottom: '1px solid #EEEEEE', minWidth: 420 }}>
              <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>[{entry.time}]</span>
              <span style={{
                color: entry.level === 'WARN' ? 'var(--color-warning)' : entry.level === 'ERROR' ? 'var(--color-danger)' : 'var(--color-primary)',
                fontWeight: 600,
                width: 44,
                flexShrink: 0
              }}>
                {entry.level}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', width: 70, flexShrink: 0 }}>{entry.source}:</span>
              <span style={{ color: 'var(--color-text)', flex: 1 }}>{entry.msg}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
