import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { CHART_RX_COLOR, CHART_TX_COLOR } from '../../lib/constants.js'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-surface-3)', border: '1px solid var(--color-border-strong)',
      borderRadius: 6, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-family-mono)',
    }}>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <span>{p.name.toUpperCase()}</span>
          <span>{p.value.toFixed(2)} MB/s</span>
        </div>
      ))}
    </div>
  )
}

export default function BandwidthChart({ data, height = 160 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradRx" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CHART_RX_COLOR} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_RX_COLOR} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradTx" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CHART_TX_COLOR} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_TX_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" hide />
        <YAxis tickFormatter={v => `${v.toFixed(1)}`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
          formatter={v => <span style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 10 }}>{v}</span>}
        />
        <Area type="monotone" dataKey="rx" name="Download" stroke={CHART_RX_COLOR} strokeWidth={1.5} fill="url(#gradRx)" dot={false} isAnimationActive={false} />
        <Area type="monotone" dataKey="tx" name="Upload"   stroke={CHART_TX_COLOR} strokeWidth={1.5} fill="url(#gradTx)" dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
