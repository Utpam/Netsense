import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import PageHeader from '../../components/common/PageHeader.jsx'
import BandwidthChart from '../../components/traffic/BandwidthChart.jsx'
import MetricCard from '../../components/common/MetricCard.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import useTrafficStore from '../../store/useTrafficStore.js'
import { formatBytes, formatRate } from '../../lib/utils.js'
import { Activity, Download, Upload } from 'lucide-react'
import { CHART_RX_COLOR, CHART_TX_COLOR } from '../../lib/constants.js'

export default function AdminTraffic() {
  const history  = useTrafficStore(s => s.history)
  const live     = useTrafficStore(s => s.live)
  const daily    = useTrafficStore(s => s.daily)
  const monthly  = useTrafficStore(s => s.monthly)
  const top      = useTrafficStore(s => s.top)

  const topColumns = [
    { key: 'name', label: 'Device',   sortable: true, render: (v, row) => <div><div style={{ fontWeight: 500 }}>{v}</div><div className="mono" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.ip}</div></div> },
    { key: 'rx',   label: 'Download', sortable: true, mono: true, render: v => <span style={{ color: 'var(--color-primary)' }}>↓ {formatBytes(v)}</span> },
    { key: 'tx',   label: 'Upload',   sortable: true, mono: true, render: v => <span style={{ color: 'var(--color-info)'    }}>↑ {formatBytes(v)}</span> },
    { key: '_total', label: 'Total',  sortable: false, render: (_, r) => <span className="mono">{formatBytes(r.rx + r.tx)}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Traffic Monitor"
        subtitle="Real-time and historical bandwidth usage"
      />

      {/* Live metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 16 }}>
        <MetricCard label="Download Rate" value={formatRate(live.rxRate)} icon={Download} accentColor="var(--color-primary)" />
        <MetricCard label="Upload Rate"   value={formatRate(live.txRate)} icon={Upload}   accentColor="var(--color-info)"    />
        <MetricCard label="Total RX"  value={formatBytes(live.rxTotal)} icon={Activity} />
        <MetricCard label="Total TX"  value={formatBytes(live.txTotal)} icon={Activity} />
        <MetricCard label="This Month RX" value={`${monthly.current.rx} GB`} icon={Download} />
        <MetricCard label="This Month TX" value={`${monthly.current.tx} GB`} icon={Upload}   />
      </div>

      {/* Live chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">Live Bandwidth (MB/s)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Live · 2 s</span>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <BandwidthChart data={history} height={180} />
        </div>
      </div>

      {/* Daily usage + top talkers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Daily Usage (GB)</span></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={daily} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border-strong)', borderRadius: 6, fontSize: 12 }}
                  formatter={(v) => [`${v} GB`]}
                />
                <Legend formatter={v => <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>{v}</span>} />
                <Bar dataKey="rx" name="Download" fill={CHART_RX_COLOR} radius={[2, 2, 0, 0]} />
                <Bar dataKey="tx" name="Upload"   fill={CHART_TX_COLOR} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Top Talkers</span></div>
          <DataTable columns={topColumns} rows={top} rowKey="ip" emptyText="No data" />
        </div>
      </div>
    </div>
  )
}
