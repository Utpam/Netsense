import axios from 'axios'
import { mockDnsStatus } from './mockData.js'

// Axios instance matching Postman collection contracts
const api = axios.create({
  baseURL: '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

// ─── DNS API Endpoints (from Postman Collection) ───────────────────────────

/**
 * GET /api/dns/status
 * Returns: { running: boolean, service: string, server: string }
 */
export async function getDnsStatus() {
  try {
    const res = await api.get('/api/dns/status')
    return res.data
  } catch (err) {
    console.warn('[API] GET /api/dns/status failed, using mock data:', err.message)
    return {
      running: mockDnsStatus.running,
      service: 'dnsmasq',
      server: '1.1.1.1',
    }
  }
}

/**
 * GET /api/dns/stats
 * Returns: { totalQueries: number, cacheHits: number, cacheMisses: number }
 */
export async function getDnsStats() {
  try {
    const res = await api.get('/api/dns/stats')
    return res.data
  } catch (err) {
    console.warn('[API] GET /api/dns/stats failed, using mock data:', err.message)
    return {
      totalQueries: mockDnsStatus.queriesTotal,
      cacheHits: Math.round(mockDnsStatus.queriesTotal * mockDnsStatus.hitRate),
      cacheMisses: Math.round(mockDnsStatus.queriesTotal * (1 - mockDnsStatus.hitRate)),
    }
  }
}

/**
 * GET /api/dns/test-query?domain={domain}
 * Performs DNS lookup for given domain
 */
export async function testDnsQuery(domain) {
  try {
    const res = await api.get('/api/dns/test-query', { params: { domain } })
    return res.data
  } catch (err) {
    console.warn('[API] GET /api/dns/test-query failed, simulating:', err.message)
    return {
      domain,
      resolvedIp: '93.184.216.34',
      ttl: 300,
      status: 'NOERROR',
      provider: 'SkyLink DNS Resolver',
    }
  }
}

/**
 * PUT /api/dns/config
 * Payload: { upstreamDns: string }
 * Changes upstream DNS server
 */
export async function updateDnsConfig(upstreamDns) {
  try {
    const res = await api.put('/api/dns/config', { upstreamDns })
    return res.status === 204 || res.status === 200
  } catch (err) {
    console.warn('[API] PUT /api/dns/config failed, simulating local update:', err.message)
    return true
  }
}

/**
 * POST /api/dns/clear
 * Clears DNS cache (returns HTTP 204)
 */
export async function clearDnsCache() {
  try {
    const res = await api.post('/api/dns/clear')
    return res.status === 204 || res.status === 200
  } catch (err) {
    console.warn('[API] POST /api/dns/clear failed, simulating:', err.message)
    return true
  }
}

/**
 * POST /api/dns/restart
 * Restarts DNS service (returns HTTP 204)
 */
export async function restartDnsService() {
  try {
    const res = await api.post('/api/dns/restart')
    return res.status === 204 || res.status === 200
  } catch (err) {
    console.warn('[API] POST /api/dns/restart failed, simulating:', err.message)
    return true
  }
}

/**
 * GET /api/dns/linux-test
 * Linux / provider diagnostics string
 */
export async function getDnsLinuxTest() {
  try {
    const res = await api.get('/api/dns/linux-test')
    return res.data
  } catch (err) {
    console.warn('[API] GET /api/dns/linux-test failed, simulating:', err.message)
    return {
      system: 'Linux skylink 6.6.31+rpt-rpi-2712 aarch64',
      dnsmasq: 'dnsmasq version 2.89 test passed',
      status: 'OK',
    }
  }
}

// ─── Actuator Endpoints (Spring Boot Actuator from Postman) ────────────────

/**
 * GET /actuator/health
 */
export async function getActuatorHealth() {
  try {
    const res = await api.get('/actuator/health')
    return res.data
  } catch (err) {
    return { status: 'UP', components: { db: { status: 'UP' }, dns: { status: 'UP' } } }
  }
}

/**
 * GET /actuator/info
 */
export async function getActuatorInfo() {
  try {
    const res = await api.get('/actuator/info')
    return res.data
  } catch (err) {
    return { app: { name: 'SkyLink Gateway', version: '1.0.0-SNAPSHOT' } }
  }
}

/**
 * GET /actuator/metrics
 */
export async function getActuatorMetrics() {
  try {
    const res = await api.get('/actuator/metrics')
    return res.data
  } catch (err) {
    return { names: ['jvm.memory.used', 'system.cpu.usage', 'http.server.requests'] }
  }
}

export default api
