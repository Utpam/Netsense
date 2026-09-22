import { Activity, ArrowDown, ArrowUp } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import useTrafficStore from '../../store/useTrafficStore.js'
import { formatBytes, formatRate } from '../../lib/utils.js'
import { mockTopTalkers, mockDailyUsage } from '../../lib/mockData.js'

export default function TrafficSection() {
  const live = useTrafficStore(s => s.live)

  const topTalkerCols = [
    { key: 'name', label: 'Device Name', sortable: true },
    { key: 'ip', label: 'IP Address', mono: true, sortable: true },
    { key: 'rx', label: 'Data Downloaded', mono: true, sortable: true, render: v => formatBytes(v) },
    { key: 'tx', label: 'Data Uploaded', mono: true, sortable: true, render: v => formatBytes(v) },
    {
      key: 'total',
      label: 'Combined Traffic',
      mono: true,
      render: (_, r) => formatBytes(r.rx + r.tx)
    }
  ]

  const dailyCols = [
    { key: 'day', label: 'Day', sortable: true },
    { key: 'rx', label: 'Download Volume', mono: true, render: v => `${v} GB` },
    { key: 'tx', label: 'Upload Volume', mono: true, render: v => `${v} GB` },
    { key: 'total', label: 'Daily Total', mono: true, render: (_, r) => `${(r.rx + r.tx).toFixed(1)} GB` },
  ]

  return (
    <div>
      {/* ── Bandwidth & Accumulator Overview ────────────────────── */}
      <SectionCard
        title="Bandwidth Utilization & Cumulative Traffic"
        subtitle="Network interface byte counters and active flow tracking"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="info-block">
            <div className="info-block-label">Total Ingress (RX)</div>
            <div className="info-block-value mono" style={{ fontSize: 16, color: 'var(--color-primary)' }}>
              {formatBytes(live.rxTotal)}
            </div>
            <div className="info-block-sub">Current rate: {formatRate(live.rxRate)}</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Total Egress (TX)</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              {formatBytes(live.txTotal)}
            </div>
            <div className="info-block-sub">Current rate: {formatRate(live.txRate)}</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Active Sockets</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              64 Tracked Flows
            </div>
            <div className="info-block-sub">Conntrack table utilization: 4%</div>
          </div>
        </div>
      </SectionCard>

      {/* ── Top Devices by Consumption ──────────────────────────── */}
      <SectionCard
        title="Top Talkers (Bandwidth per Host)"
        subtitle="Highest data consuming endpoints on the local subnet"
      >
        <DataTable
          columns={topTalkerCols}
          rows={mockTopTalkers}
          rowKey="ip"
        />
      </SectionCard>

      {/* ── Daily Consumption Breakdown ─────────────────────────── */}
      <SectionCard
        title="Historical Daily Consumption"
        subtitle="Aggregated daily byte volume for the past 7 days"
      >
        <DataTable
          columns={dailyCols}
          rows={mockDailyUsage}
          rowKey="day"
        />
      </SectionCard>
    </div>
  )
}
