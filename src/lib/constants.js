// ─── Application constants ────────────────────────────────────────

export const APP_NAME = 'SkyLink'
export const APP_VERSION = '1.0.0'

// API base URL — resolved via Vite proxy in dev, same-origin in prod
export const API_BASE = '/api/v1'
export const WS_BASE  = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`

// Polling intervals (ms)
export const POLL_SIGNAL  = 5_000   // 5 s
export const POLL_TRAFFIC = 2_000   // 2 s
export const POLL_DEVICES = 10_000  // 10 s
export const POLL_SYSTEM  = 15_000  // 15 s

// Auth
export const AUTH_TOKEN_KEY  = 'sl_token'
export const AUTH_EXPIRY_KEY = 'sl_expiry'

// Route paths
export const ROUTES = {
  login:    '/login',
  client:   '/client',
  admin:    '/admin',
}

// Signal tech labels
export const TECH_LABELS = {
  '2G':  '2G / GPRS',
  '3G':  '3G / HSPA+',
  'LTE': '4G / LTE',
  '5G':  '5G / NR',
}

// QoS priority labels
export const QOS_PRIORITIES = [
  { value: 1, label: 'Highest' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Above Normal' },
  { value: 4, label: 'Normal' },
  { value: 5, label: 'Below Normal' },
  { value: 6, label: 'Low' },
  { value: 7, label: 'Very Low' },
  { value: 8, label: 'Lowest' },
]

// VPN status
export const VPN_STATUS = {
  UP:         'up',
  DOWN:       'down',
  CONNECTING: 'connecting',
  ERROR:      'error',
}

// DNS record types
export const DNS_RECORD_TYPES = ['A', 'AAAA', 'PTR', 'CNAME']

// Firewall actions
export const FW_ACTIONS = ['ACCEPT', 'DROP', 'REJECT']

// Traffic chart colors
export const CHART_RX_COLOR = '#38bdf8'
export const CHART_TX_COLOR = '#818cf8'
