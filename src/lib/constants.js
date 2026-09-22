// ─── Application constants ────────────────────────────────────────

export const APP_NAME = 'NetSense'
export const APP_VERSION = '2.4.0-rpi'

// API base URL — resolved via Vite proxy in dev, same-origin in prod
export const API_BASE = '/api'
export const WS_BASE  = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`

// Polling intervals (ms)
export const POLL_SIGNAL  = 5_000   // 5 s
export const POLL_TRAFFIC = 2_000   // 2 s
export const POLL_DEVICES = 10_000  // 10 s
export const POLL_SYSTEM  = 15_000  // 15 s

// Auth
export const AUTH_TOKEN_KEY  = 'netsense_token'
export const AUTH_EXPIRY_KEY = 'netsense_expiry'

// Route paths - Clean progressive disclosure structure
export const ROUTES = {
  dashboard:  '/',
  devices:    '/devices',
  files:      '/files',
  services:   '/services',
  advanced:   '/advanced',
  help:       '/help',
  login:      '/login',
}

// Signal tech labels
export const TECH_LABELS = {
  '2G':  '2G / GPRS',
  '3G':  '3G / HSPA+',
  'LTE': '4G LTE',
  '5G':  '5G NR',
}

// QoS priority labels
export const QOS_PRIORITIES = [
  { value: 1, label: 'Highest (Priority 1)' },
  { value: 2, label: 'High (Priority 2)' },
  { value: 3, label: 'Above Normal (Priority 3)' },
  { value: 4, label: 'Normal (Priority 4)' },
  { value: 5, label: 'Below Normal (Priority 5)' },
  { value: 6, label: 'Low (Priority 6)' },
  { value: 7, label: 'Very Low (Priority 7)' },
  { value: 8, label: 'Lowest (Priority 8)' },
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

// Traffic chart colors (NetSense Blue palette)
export const CHART_RX_COLOR = '#002AA7'
export const CHART_TX_COLOR = '#0284C7'
