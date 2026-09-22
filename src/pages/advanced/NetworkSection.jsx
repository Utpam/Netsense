import { useState } from 'react'
import { Network, Globe, Server, Save, Check } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { mockInterfaces, mockWan, mockLan, mockRoutes } from '../../lib/mockData.js'
import { formatBytes, formatRate } from '../../lib/utils.js'

export default function NetworkSection() {
  const [lanSettings, setLanSettings] = useState({
    gatewayIp: mockLan.gatewayIp,
    subnet: mockLan.subnet,
    dhcpStart: mockLan.dhcpStart,
    dhcpEnd: mockLan.dhcpEnd,
    dhcpLease: mockLan.dhcpLease
  })
  const [saved, setSaved] = useState(false)

  const handleSaveLan = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const ifaceCols = [
    { key: 'name', label: 'Interface', mono: true, sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'state', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'ip', label: 'IP Address / Mask', mono: true, render: (v, r) => `${v}${r.mask}` },
    { key: 'mac', label: 'MAC Address', mono: true },
    { key: 'rx', label: 'RX Total', mono: true, render: v => formatBytes(v) },
    { key: 'tx', label: 'TX Total', mono: true, render: v => formatBytes(v) },
  ]

  const routeCols = [
    { key: 'destination', label: 'Destination', mono: true },
    { key: 'gateway', label: 'Gateway', mono: true },
    { key: 'iface', label: 'Interface', mono: true },
    { key: 'metric', label: 'Metric', mono: true },
  ]

  return (
    <div>
      {/* ── Interfaces Overview ─────────────────────────────────── */}
      <SectionCard
        title="Network Interfaces"
        subtitle="Physical and virtual network interface controllers"
        badge={<StatusBadge status="active" label="4 Interfaces" />}
      >
        <DataTable
          columns={ifaceCols}
          rows={mockInterfaces}
          rowKey="name"
        />
      </SectionCard>

      {/* ── WAN Configuration ───────────────────────────────────── */}
      <SectionCard
        title="WAN (Wide Area Network)"
        subtitle="Public cellular uplink parameters"
        badge={<StatusBadge status={mockWan.state} />}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div className="info-block">
            <div className="info-block-label">Public IP</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{mockWan.ip}</div>
            <div className="info-block-sub">Interface: {mockWan.iface}</div>
          </div>
          <div className="info-block">
            <div className="info-block-label">Default Gateway</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{mockWan.gateway}</div>
            <div className="info-block-sub">Upstream route</div>
          </div>
          <div className="info-block">
            <div className="info-block-label">Upstream DNS</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{mockWan.dns.join(', ')}</div>
            <div className="info-block-sub">Provider DNS servers</div>
          </div>
        </div>
      </SectionCard>

      {/* ── LAN & DHCP Settings (Progressive Disclosure) ────────── */}
      <SectionCard
        title="LAN & DHCP Server"
        subtitle="Local subnet configuration and DHCP IP pool assignment"
        badge={<StatusBadge status="running" label="DHCP Active" />}
        configureLabel="Configure DHCP"
        configureContent={
          <form onSubmit={handleSaveLan}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Router IP (Gateway)</label>
                <input
                  className="form-input mono"
                  value={lanSettings.gatewayIp}
                  onChange={e => setLanSettings({ ...lanSettings, gatewayIp: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subnet Mask</label>
                <input
                  className="form-input mono"
                  value={lanSettings.subnet}
                  onChange={e => setLanSettings({ ...lanSettings, subnet: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">DHCP Pool Start</label>
                <input
                  className="form-input mono"
                  value={lanSettings.dhcpStart}
                  onChange={e => setLanSettings({ ...lanSettings, dhcpStart: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">DHCP Pool End</label>
                <input
                  className="form-input mono"
                  value={lanSettings.dhcpEnd}
                  onChange={e => setLanSettings({ ...lanSettings, dhcpEnd: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lease Time</label>
                <select
                  className="form-select"
                  value={lanSettings.dhcpLease}
                  onChange={e => setLanSettings({ ...lanSettings, dhcpLease: e.target.value })}
                >
                  <option value="12h">12 Hours</option>
                  <option value="24h">24 Hours (Default)</option>
                  <option value="48h">48 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={12} />
                Save LAN Settings
              </button>
              {saved && (
                <span style={{ fontSize: 12, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} />
                  LAN configuration updated successfully.
                </span>
              )}
            </div>
          </form>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div className="info-block">
            <div className="info-block-label">LAN Gateway</div>
            <div className="info-block-value mono" style={{ fontSize: 15 }}>{lanSettings.gatewayIp}</div>
            <div className="info-block-sub">{lanSettings.subnet}</div>
          </div>
          <div className="info-block">
            <div className="info-block-label">DHCP Address Range</div>
            <div className="info-block-value mono" style={{ fontSize: 14 }}>
              .100 - .254
            </div>
            <div className="info-block-sub">Lease: {lanSettings.dhcpLease}</div>
          </div>
        </div>
      </SectionCard>

      {/* ── Routing Table ───────────────────────────────────────── */}
      <SectionCard
        title="Routing Table"
        subtitle="Kernel IPv4 routing table"
      >
        <DataTable
          columns={routeCols}
          rows={mockRoutes}
          rowKey="destination"
        />
      </SectionCard>
    </div>
  )
}
