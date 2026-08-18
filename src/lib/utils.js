// ─── Formatting utilities ─────────────────────────────────────────

/**
 * Format bytes into human-readable string
 * @param {number} bytes
 * @param {number} decimals
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Format bits-per-second rate
 */
export function formatRate(bytesPerSec) {
  if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`
  if (bytesPerSec < 1024 * 1024 * 1024) return `${(bytesPerSec / 1024 / 1024).toFixed(2)} MB/s`
  return `${(bytesPerSec / 1024 / 1024 / 1024).toFixed(2)} GB/s`
}

/**
 * Format uptime seconds to human string
 */
export function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

/**
 * Format MAC address (ensure uppercase, colon-separated)
 */
export function formatMac(mac) {
  return mac.toUpperCase()
}

/**
 * Format a Date to a relative string (e.g. "2 minutes ago")
 */
export function timeAgo(date) {
  const now = Date.now()
  const diff = now - new Date(date).getTime()
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/**
 * Get signal quality label and color class based on RSSI
 */
export function signalQuality(rssi) {
  if (rssi >= -70) return { label: 'Excellent', color: 'text-success', badgeClass: 'badge-success', gauge: 'gauge-excellent', pct: 100 }
  if (rssi >= -80) return { label: 'Good',      color: 'text-success', badgeClass: 'badge-success', gauge: 'gauge-good',      pct: 75  }
  if (rssi >= -90) return { label: 'Fair',       color: 'text-warning', badgeClass: 'badge-warning', gauge: 'gauge-fair',      pct: 45  }
  return               { label: 'Poor',       color: 'text-danger',  badgeClass: 'badge-danger',  gauge: 'gauge-poor',      pct: 20  }
}

/**
 * Clamp a number between min and max
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

/**
 * Generate the last N seconds of traffic data points
 */
export function generateTrafficHistory(points = 60) {
  return Array.from({ length: points }, (_, i) => ({
    t: i - points + 1,
    rx: +(Math.random() * 3 + 0.5).toFixed(2),
    tx: +(Math.random() * 1 + 0.1).toFixed(2),
  }))
}

/**
 * Generate signal history (last N samples, 5s each)
 */
export function generateSignalHistory(points = 30) {
  let rssi = -76
  return Array.from({ length: points }, (_, i) => {
    rssi += (Math.random() - 0.5) * 4
    rssi = clamp(rssi, -100, -55)
    return { t: i, rssi: Math.round(rssi) }
  })
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Pluralize a word
 */
export function pluralize(count, word, suffix = 's') {
  return `${count} ${count === 1 ? word : word + suffix}`
}
