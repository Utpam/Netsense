import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import PageHeader from '../../components/common/PageHeader.jsx'
import useTrafficStore from '../../store/useTrafficStore.js'
import { formatBytes } from '../../lib/utils.js'
import { CHART_RX_COLOR, CHART_TX_COLOR } from '../../lib/constants.js'

export default function ClientUsage() {
  const daily   = useTrafficStore(s => s.daily)
  const monthly = useTrafficStore(s => s.monthly)

  const totalRx = daily.reduce((a, d) => a + d.rx, 0).toFixed(1)
  const totalTx = daily.reduce((a, d) => a + d.tx, 0).toFixed(1)

  const pieData = [
    { name: 'Download', value: +totalRx },
    { name: 'Upload',   value: +totalTx },
  ]

  return (
    <div>
      <PageHeader title="Data Usage" subtitle="This week's usage by day" />

      {/* Monthly summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'This Month DL', value: `${monthly.current.rx} GB`, color: 'var(--color-primary)' },
          { label: 'This Month UL', value: `${monthly.current.tx} GB`, color: 'var(--color-info)' },
          { label: 'This Week DL',  value: `${totalRx} GB`,            color: 'var(--color-primary)' },
          { label: 'This Week UL',  value: `${totalTx} GB`,            color: 'var(--color-info)' },
        ].map(m => (
          <div key={m.label} className="card" style={{ padding: '12px 16px' }}>
            <div className="metric-label">{m.label}</div>
            <div className="mono" style={{ marginTop: 8, fontWeight: 700, fontSize: 22, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Daily Usage (GB)</span></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border-strong)', borderRadius: 6, fontSize: 12 }} formatter={v => [`${v} GB`]} />
                <Legend formatter={v => <span style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{v}</span>} />
                <Bar dataKey="rx" name="Download" fill={CHART_RX_COLOR} radius={[2, 2, 0, 0]} />
                <Bar dataKey="tx" name="Upload"   fill={CHART_TX_COLOR} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">DL / UL Split</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PieChart width={180} height={160}>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                <Cell fill={CHART_RX_COLOR} />
                <Cell fill={CHART_TX_COLOR} />
              </Pie>
              <Tooltip formatter={v => [`${v} GB`]} contentStyle={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border-strong)', borderRadius: 6, fontSize: 12 }} />
            </PieChart>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: i === 0 ? CHART_RX_COLOR : CHART_TX_COLOR, display: 'inline-block' }} />
                  <span style={{ color: 'var(--color-text-muted)' }}>{d.name}</span>
                  <span className="mono">{d.value} GB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
