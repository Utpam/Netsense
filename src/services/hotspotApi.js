import api from '../lib/api.js'

/**
 * Hotspot API Service
 * Handles communication with the NetSense / SkyLink Hotspot endpoints:
 * - GET /api/hotspot/status
 * - GET /api/hotspot/active
 * - GET /api/hotspot/connected-devices (aliases: /devices, /clients)
 */

/**
 * Normalizes a device object defensively to ensure expected fields exist.
 * Backend contract:
 * {
 *   "ipAddress": "192.168.137.146",
 *   "macAddress": "1e:f6:2c:c7:74:07",
 *   "deviceName": "Shashank-s-M12"
 * }
 */
export function normalizeDevice(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      deviceName: 'Unknown device',
      name: 'Unknown device',
      ipAddress: 'Unknown IP',
      ip: 'Unknown IP',
      macAddress: '—',
      mac: '—',
      online: true,
    }
  }

  const deviceName = raw.deviceName || raw.name || raw.hostname || 'Unknown device'
  const ipAddress  = raw.ipAddress || raw.ip || 'Unknown IP'
  const macAddress = raw.macAddress || raw.mac || '—'

  return {
    ...raw,
    deviceName,
    name: deviceName,
    ipAddress,
    ip: ipAddress,
    macAddress,
    mac: macAddress,
    online: raw.online !== undefined ? raw.online : true,
    blocked: Boolean(raw.blocked),
    vendor: raw.vendor || 'Wi-Fi Client',
  }
}

/**
 * GET /api/hotspot/status
 * Response: { active: boolean, connectedDeviceCount: number }
 */
export async function getHotspotStatus() {
  const res = await api.get('/api/hotspot/status')
  const data = res.data

  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid response structure from /api/hotspot/status')
  }

  return {
    active: Boolean(data.active),
    connectedDeviceCount: typeof data.connectedDeviceCount === 'number'
      ? data.connectedDeviceCount
      : Number(data.connectedDeviceCount || 0),
  }
}

/**
 * GET /api/hotspot/active
 * Response: boolean (true | false)
 */
export async function getHotspotActive() {
  const res = await api.get('/api/hotspot/active')
  return Boolean(res.data)
}

/**
 * GET /api/hotspot/connected-devices
 * Aliases: /api/hotspot/devices, /api/hotspot/clients
 * Response: Array<{ ipAddress: string, macAddress: string, deviceName: string }>
 */
export async function getConnectedDevices() {
  const res = await api.get('/api/hotspot/connected-devices')
  const list = Array.isArray(res.data) ? res.data : []
  return list.map(normalizeDevice)
}
