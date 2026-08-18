import { generateTrafficHistory, generateSignalHistory } from './utils.js'

// ─── Signal / Modem ───────────────────────────────────────────────
export const mockSignal = {
  rssi:       -72,
  rsrp:       -103,
  rsrq:       -11,
  sinr:       16,
  band:       'B3',
  frequency:  '1800 MHz',
  technology: 'LTE',
  operator:   'Airtel 4G',
  connected:  true,
}

export const mockModem = {
  model:      'Quectel EC25-E',
  imei:       '359072061070587',
  iccid:      '8991101200003204520',
  state:      'connected',
  apn:        'airtelgprs.com',
  ip:         '100.116.43.9',
  gateway:    '100.116.43.1',
  mcc:        '404',
  mnc:        '10',
}

export const mockSignalHistory = generateSignalHistory(40)

// ─── System ────────────────────────────────────────────────────────
export const mockSystem = {
  cpu:         24,
  cpuCores:    4,
  memUsed:     1.4,
  memTotal:    8,
  temp:        47,
  uptimeSeconds: 476591,  // ~5d 12h
  hostname:    'skylink-01',
  model:       'Raspberry Pi 5 (8GB)',
  firmware:    'SkyLink OS 1.0.0',
  kernel:      '6.6.31+rpt-rpi-2712',
  lanIp:       '192.168.1.1',
  wanIp:       '100.116.43.9',
}

// ─── Network interfaces ────────────────────────────────────────────
export const mockInterfaces = [
  { name: 'wwan0', description: 'Cellular WAN',   state: 'up', ip: '100.116.43.9',  mask: '/30', mac: 'N/A', rx: 92_274_688_000, tx: 23_068_672_000, rxRate: 1_843_200, txRate: 307_200 },
  { name: 'eth0',  description: 'LAN (Ethernet)',  state: 'up', ip: '192.168.1.1',   mask: '/24', mac: 'dc:a6:32:1a:2b:3c', rx: 12_884_901_888, tx: 49_392_123_904, rxRate: 0, txRate: 0 },
  { name: 'wlan0', description: 'Wi-Fi Hotspot',   state: 'up', ip: '192.168.2.1',   mask: '/24', mac: 'dc:a6:32:1a:2b:3d', rx: 4_294_967_296,  tx: 17_179_869_184, rxRate: 614_400, txRate: 204_800 },
  { name: 'lo',    description: 'Loopback',        state: 'up', ip: '127.0.0.1',     mask: '/8',  mac: 'N/A', rx: 0, tx: 0, rxRate: 0, txRate: 0 },
]

// ─── WAN ───────────────────────────────────────────────────────────
export const mockWan = {
  ip:       '100.116.43.9',
  gateway:  '100.116.43.1',
  dns:      ['8.8.8.8', '8.8.4.4'],
  iface:    'wwan0',
  state:    'connected',
}

// ─── LAN ───────────────────────────────────────────────────────────
export const mockLan = {
  subnet:       '192.168.1.0/24',
  gatewayIp:    '192.168.1.1',
  dhcpStart:    '192.168.1.100',
  dhcpEnd:      '192.168.1.254',
  dhcpLease:    '24h',
  dnsForward:   '192.168.1.1',
}

// ─── Devices ───────────────────────────────────────────────────────
export const mockDevices = [
  { mac: 'a4:c3:f0:11:22:33', ip: '192.168.1.101', name: 'MacBook Pro',      hostname: 'macbook-pro.local',   vendor: 'Apple',     online: true,  blocked: false, rx: 4_831_838_208, tx: 1_073_741_824, lastSeen: new Date(Date.now() - 10_000) },
  { mac: 'b8:27:eb:55:66:77', ip: '192.168.1.102', name: 'iPhone 15 Pro',    hostname: 'iphone.local',        vendor: 'Apple',     online: true,  blocked: false, rx: 2_147_483_648, tx:   536_870_912, lastSeen: new Date(Date.now() - 5_000)  },
  { mac: 'dc:53:60:aa:bb:cc', ip: '192.168.1.103', name: 'Smart TV',         hostname: 'samsung-tv.local',    vendor: 'Samsung',   online: true,  blocked: false, rx: 9_663_676_416, tx:   268_435_456, lastSeen: new Date(Date.now() - 2_000)  },
  { mac: '00:11:32:dd:ee:ff', ip: '192.168.1.104', name: 'Gaming PC',        hostname: 'gaming-pc',           vendor: 'ASUSTeK',   online: true,  blocked: false, rx: 12_884_901_888, tx: 3_221_225_472, lastSeen: new Date()                  },
  { mac: 'f8:e0:79:34:ab:cd', ip: '192.168.1.105', name: 'Tablet',           hostname: 'ipad.local',          vendor: 'Apple',     online: true,  blocked: false, rx:   805_306_368, tx:   134_217_728, lastSeen: new Date(Date.now() - 60_000) },
  { mac: '50:de:06:78:90:12', ip: '192.168.1.106', name: 'NAS Drive',        hostname: 'nas.local',           vendor: 'Synology',  online: true,  blocked: false, rx:   268_435_456, tx: 21_474_836_480, lastSeen: new Date()                  },
  { mac: '9c:b6:d0:ef:01:23', ip: '192.168.1.107', name: 'Work Laptop',      hostname: 'dell-laptop',         vendor: 'Dell',      online: false, blocked: false, rx: 1_073_741_824, tx:   322_122_547, lastSeen: new Date(Date.now() - 3_600_000) },
  { mac: 'd4:f5:27:45:67:89', ip: '192.168.1.108', name: 'Unknown Device',   hostname: '(unknown)',           vendor: 'Unknown',   online: false, blocked: true,  rx:   134_217_728, tx:    16_777_216, lastSeen: new Date(Date.now() - 86_400_000) },
]

// ─── Traffic ───────────────────────────────────────────────────────
export const mockTrafficLive = {
  rxRate: 1_843_200,
  txRate:   307_200,
  rxTotal: 92_274_688_000,
  txTotal: 23_068_672_000,
}

export const mockTrafficHistory = generateTrafficHistory(60)

export const mockDailyUsage = [
  { day: 'Mon', rx: 4.2, tx: 1.1 },
  { day: 'Tue', rx: 7.8, tx: 2.3 },
  { day: 'Wed', rx: 5.5, tx: 1.7 },
  { day: 'Thu', rx: 11.2, tx: 3.4 },
  { day: 'Fri', rx: 9.1, tx: 2.8 },
  { day: 'Sat', rx: 13.6, tx: 4.1 },
  { day: 'Sun', rx: 6.4, tx: 1.9 },
]

export const mockMonthlyUsage = {
  current: { rx: 87.3, tx: 21.6, month: 'August' },
  previous: { rx: 74.1, tx: 18.9, month: 'July' },
}

export const mockTopTalkers = [
  { ip: '192.168.1.104', name: 'Gaming PC',    rx: 12_884_901_888, tx: 3_221_225_472 },
  { ip: '192.168.1.103', name: 'Smart TV',     rx: 9_663_676_416,  tx:   268_435_456 },
  { ip: '192.168.1.106', name: 'NAS Drive',    rx:   268_435_456,  tx: 21_474_836_480 },
  { ip: '192.168.1.101', name: 'MacBook Pro',  rx: 4_831_838_208,  tx: 1_073_741_824 },
  { ip: '192.168.1.102', name: 'iPhone',       rx: 2_147_483_648,  tx:   536_870_912 },
]

// ─── QoS Rules ─────────────────────────────────────────────────────
export const mockQosRules = [
  { id: 1, name: 'Video Streaming',    target: '192.168.1.103', priority: 1, downloadKbps: 25_000, uploadKbps: 5_000,  enabled: true  },
  { id: 2, name: 'Online Gaming',      target: '192.168.1.104', priority: 1, downloadKbps: 20_000, uploadKbps: 10_000, enabled: true  },
  { id: 3, name: 'Work Laptop',        target: '192.168.1.107', priority: 2, downloadKbps: 15_000, uploadKbps: 8_000,  enabled: true  },
  { id: 4, name: 'Background Updates', target: '0.0.0.0/0',     priority: 8, downloadKbps: 2_000,  uploadKbps: 1_000,  enabled: false },
  { id: 5, name: 'NAS Backup',         target: '192.168.1.106', priority: 7, downloadKbps: 5_000,  uploadKbps: 50_000, enabled: true  },
]

export const mockQosStatus = {
  mode:            'HTB',
  enabled:         true,
  globalDownKbps:  100_000,
  globalUpKbps:    20_000,
  interface:       'wwan0',
}

// ─── DNS ───────────────────────────────────────────────────────────
export const mockDnsStatus = {
  running:       true,
  cacheSize:     150,
  cacheEntries:  112,
  queriesTotal:  18_453,
  queriesPerMin: 47,
  hitRate:       0.72,
  uptime:        476_591,
}

export const mockDnsRecords = [
  { id: 1, hostname: 'nas.skylink',     ip: '192.168.1.106', type: 'A',   createdAt: '2026-07-10' },
  { id: 2, hostname: 'skylink.local',   ip: '192.168.1.1',   type: 'A',   createdAt: '2026-07-10' },
  { id: 3, hostname: 'cam.skylink',     ip: '192.168.1.150', type: 'A',   createdAt: '2026-08-01' },
]

export const mockDnsBlocklist = [
  { id: 1, domain: 'ads.example.com',       reason: 'Advertising',  createdAt: '2026-07-15' },
  { id: 2, domain: 'doubleclick.net',       reason: 'Tracking',     createdAt: '2026-07-15' },
  { id: 3, domain: 'googleadservices.com',  reason: 'Advertising',  createdAt: '2026-07-20' },
  { id: 4, domain: 'telemetry.example.com', reason: 'Telemetry',    createdAt: '2026-08-05' },
]

export const mockDnsUpstream = ['8.8.8.8', '8.8.4.4']

export const mockDnsLog = [
  { time: '16:44:21', client: '192.168.1.101', query: 'api.github.com',        type: 'A',    result: 'HIT',  ip: '140.82.113.5'  },
  { time: '16:44:20', client: '192.168.1.104', query: 'steam.cdn.valve.net',   type: 'A',    result: 'MISS', ip: '23.185.0.1'    },
  { time: '16:44:18', client: '192.168.1.103', query: 'prod.nflxvideo.net',    type: 'A',    result: 'HIT',  ip: '54.72.183.22'  },
  { time: '16:44:17', client: '192.168.1.102', query: 'ads.example.com',       type: 'A',    result: 'BLOCK', ip: '0.0.0.0'      },
  { time: '16:44:15', client: '192.168.1.101', query: 'fonts.googleapis.com',  type: 'A',    result: 'HIT',  ip: '172.217.16.2'  },
  { time: '16:44:12', client: '192.168.1.107', query: 'update.microsoft.com',  type: 'A',    result: 'MISS', ip: '23.103.56.23'  },
]

// ─── VPN ───────────────────────────────────────────────────────────
export const mockVpnStatus = {
  status:       'up',
  interface:    'wg0',
  publicKey:    'xTIBA5rboUvnH4htodjb6e697QjLERt1NAB4mZqp8Dg=',
  listenPort:   51820,
  rxBytes:      1_288_490_188,
  txBytes:        429_496_729,
  peers:        2,
}

export const mockVpnPeers = [
  { id: 1, name: 'Office Router',   publicKey: 'HIgo9xNzJMWLKASShiTqIybxZ0U3wGLiUeJ1PKf8ykw=', allowedIps: '10.0.0.2/32', endpoint: '203.0.113.10:51820', lastHandshake: '1 min ago', rxBytes: 858_993_459, txBytes: 268_435_456  },
  { id: 2, name: 'Home VPN Client', publicKey: 'yAnz5TF+lXXJte14tji3zlMNq+hd2rYUIgJBgB3fBmk=', allowedIps: '10.0.0.3/32', endpoint: 'dynamic',            lastHandshake: '8 min ago', rxBytes: 429_496_729, txBytes: 161_061_273  },
]

// ─── File Shares ────────────────────────────────────────────────────
export const mockFileShares = [
  { name: 'media',     path: '/srv/media',     readOnly: false, public: true,  files: 1_247 },
  { name: 'documents', path: '/srv/documents', readOnly: false, public: false, files: 348   },
  { name: 'backup',    path: '/srv/backup',    readOnly: true,  public: false, files: 5_892 },
]

export const mockFileBrowse = [
  { name: 'Movies',   isDir: true,  size: null,       modified: '2026-08-17' },
  { name: 'Music',    isDir: true,  size: null,       modified: '2026-08-10' },
  { name: 'Photos',   isDir: true,  size: null,       modified: '2026-08-15' },
  { name: 'readme.txt', isDir: false, size: 2_048,    modified: '2026-07-10' },
]

// ─── Firewall rules ─────────────────────────────────────────────────
export const mockFirewallRules = [
  { id: 1, direction: 'INPUT',   proto: 'tcp',  src: '0.0.0.0/0',  dst: '192.168.1.1', dport: '80',    action: 'ACCEPT' },
  { id: 2, direction: 'INPUT',   proto: 'tcp',  src: '0.0.0.0/0',  dst: '192.168.1.1', dport: '443',   action: 'ACCEPT' },
  { id: 3, direction: 'FORWARD', proto: 'any',  src: '192.168.1.0/24', dst: '0.0.0.0/0', dport: 'any', action: 'ACCEPT' },
  { id: 4, direction: 'INPUT',   proto: 'tcp',  src: '0.0.0.0/0',  dst: '192.168.1.1', dport: '22',    action: 'DROP'   },
  { id: 5, direction: 'OUTPUT',  proto: 'any',  src: '0.0.0.0/0',  dst: '0.0.0.0/0',  dport: 'any',   action: 'ACCEPT' },
]

// ─── Routes table ──────────────────────────────────────────────────
export const mockRoutes = [
  { destination: '0.0.0.0/0',          gateway: '100.116.43.1', iface: 'wwan0', metric: 0    },
  { destination: '100.116.43.0/30',    gateway: '0.0.0.0',      iface: 'wwan0', metric: 0    },
  { destination: '192.168.1.0/24',     gateway: '0.0.0.0',      iface: 'eth0',  metric: 100  },
  { destination: '192.168.2.0/24',     gateway: '0.0.0.0',      iface: 'wlan0', metric: 100  },
  { destination: '10.0.0.0/24',        gateway: '0.0.0.0',      iface: 'wg0',   metric: 50   },
]

// ─── Local services ─────────────────────────────────────────────────
export const mockLocalServices = [
  { name: 'File Server',  description: 'Access shared files',    url: 'smb://192.168.1.1/media', icon: 'HardDrive',  available: true  },
  { name: 'DNS Cache',    description: 'Local DNS resolver',     url: null,                      icon: 'Database',   available: true  },
  { name: 'VPN Tunnel',   description: 'WireGuard VPN active',   url: null,                      icon: 'Shield',     available: true  },
  { name: 'Web UI',       description: 'This interface',         url: 'http://skylink.local',    icon: 'Globe',      available: true  },
]
