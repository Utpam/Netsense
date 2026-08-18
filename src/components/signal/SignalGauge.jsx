import { signalQuality } from '../../lib/utils.js'

// Arc dimensions in SVG viewBox coordinates
const W = 220
const H = 145
const CX = W / 2       // 110
const CY = 115         // Center Y
const R = 80           // Arc radius
const STROKE = 12      // Arc stroke width

const START_DEG = 210   // Bottom-left
const END_DEG = -30     // Bottom-right
const TOTAL_SWEEP = 240 // 240° total sweep angle

function deg2rad(deg) {
  return (deg * Math.PI) / 180
}

/**
 * Generate SVG arc path from startDeg to endDeg (clockwise in SVG coords)
 */
function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = deg2rad(startDeg)
  const e = deg2rad(endDeg)
  const x1 = cx + r * Math.cos(s)
  const y1 = cy - r * Math.sin(s)
  const x2 = cx + r * Math.cos(e)
  const y2 = cy - r * Math.sin(e)
  const delta = (startDeg - endDeg + 360) % 360
  const large = delta > 180 ? 1 : 0
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

function clampPct(pct) {
  return Math.min(100, Math.max(0, pct))
}

export default function SignalGauge({ rssi = -80, label = 'RSSI', size = 1 }) {
  const q = signalQuality(rssi)
  const pct = clampPct(q.pct)

  const sweepDeg = (pct / 100) * TOTAL_SWEEP
  const currentEndDeg = START_DEG - sweepDeg

  // Color mapping
  const fillColors = {
    'gauge-excellent': '#22c55e',
    'gauge-good':      '#84cc16',
    'gauge-fair':      '#f59e0b',
    'gauge-poor':      '#ef4444',
  }
  const fillColor = fillColors[q.gauge] || '#38bdf8'

  // Needle angle
  const needleRad = deg2rad(currentEndDeg)
  const needleLen = R - 10
  const nx = CX + needleLen * Math.cos(needleRad)
  const ny = CY - needleLen * Math.sin(needleRad)

  // Pivot base offset for triangle needle
  const pRadLeft = needleRad + Math.PI / 2
  const pRadRight = needleRad - Math.PI / 2
  const pWidth = 4
  const px1 = CX + pWidth * Math.cos(pRadLeft)
  const py1 = CY - pWidth * Math.sin(pRadLeft)
  const px2 = CX + pWidth * Math.cos(pRadRight)
  const py2 = CY - pWidth * Math.sin(pRadRight)

  return (
    <div style={{ textAlign: 'center', userSelect: 'none', display: 'inline-block', maxWidth: '100%' }}>
      <svg
        width={W * size}
        height={H * size}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
      >
        {/* Track (Background Arc) */}
        <path
          d={arcPath(CX, CY, R, START_DEG, END_DEG)}
          fill="none"
          stroke="var(--color-surface-4)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        {/* Filled Arc (Current Signal Level) */}
        {pct > 1 && (
          <path
            d={arcPath(CX, CY, R, START_DEG, currentEndDeg)}
            fill="none"
            stroke={fillColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        )}

        {/* Tick Marks */}
        {[0, 25, 50, 75, 100].map(p => {
          const tickDeg = START_DEG - (p / 100) * TOTAL_SWEEP
          const tickRad = deg2rad(tickDeg)
          const rOut = R + STROKE / 2 + 5
          const rIn = R - STROKE / 2 - 5
          return (
            <line
              key={p}
              x1={CX + rOut * Math.cos(tickRad)}
              y1={CY - rOut * Math.sin(tickRad)}
              x2={CX + rIn * Math.cos(tickRad)}
              y2={CY - rIn * Math.sin(tickRad)}
              stroke="var(--color-surface-0)"
              strokeWidth={2}
            />
          )
        })}

        {/* Needle Pointer */}
        <polygon
          points={`${nx.toFixed(2)},${ny.toFixed(2)} ${px1.toFixed(2)},${py1.toFixed(2)} ${px2.toFixed(2)},${py2.toFixed(2)}`}
          fill={fillColor}
          opacity={0.9}
        />

        {/* Pivot Center Dot */}
        <circle cx={CX} cy={CY} r={6} fill="var(--color-surface-1)" stroke={fillColor} strokeWidth={2} />

        {/* Numerical Value Readout */}
        <text
          x={CX}
          y={CY - 22}
          textAnchor="middle"
          fontSize={26}
          fontWeight={700}
          fill="var(--color-text)"
          fontFamily="var(--font-family-mono)"
        >
          {rssi}
        </text>

        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-text-muted)"
          fontFamily="var(--font-family-sans)"
        >
          dBm
        </text>

        {/* Signal Quality Status Label */}
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={fillColor}
          fontFamily="var(--font-family-sans)"
          letterSpacing="0.06em"
        >
          {q.label.toUpperCase()}
        </text>

        {/* Scale Min / Max Labels */}
        <text x={18} y={CY + 12} fontSize={9} fill="var(--color-text-dim)" textAnchor="middle">Poor</text>
        <text x={W - 18} y={CY + 12} fontSize={9} fill="var(--color-text-dim)" textAnchor="middle">Exc.</text>
      </svg>

      {label && (
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: -2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </div>
      )}
    </div>
  )
}
