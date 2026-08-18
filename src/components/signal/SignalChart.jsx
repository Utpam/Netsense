import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import { signalQuality } from '../../lib/utils.js'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  const q = signalQuality(v)
  return (
    <div style={{
      background: 'var(--color-surface-3)', border: '1px solid var(--color-border-strong)',
      borderRadius: 6, padding: '8px 12px', fontSize: 12, fontFamily: 'var(--font-family-mono)',
    }}>
      <div style={{ color: q.color === 'text-success' ? 'var(--color-success)' : q.color === 'text-warning' ? 'var(--color-warning)' : 'var(--color-danger)' }}>
        {v} dBm — {q.label}
      </div>
    </div>
  )
}

function strokeForValue(v) {
  if (v >= -70) return '#22c55e'
  if (v >= -80) return '#84cc16'
  if (v >= -90) return '#f59e0b'
  return '#ef4444'
}

export default function SignalChart({ data, height = 120 }) {
  // Color the line based on latest value
  const latest = data[data.length - 1]?.rssi ?? -85
  const color  = strokeForValue(latest)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" hide />
        <YAxis domain={[-105, -55]} tickFormatter={v => `${v}`} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={-70} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
        <ReferenceLine y={-85} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} />
        <ReferenceLine y={-95} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} />
        <Line
          type="monotone"
          dataKey="rssi"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
