import { useState } from 'react'
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Wifi,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import useSignalStore from '../store/useSignalStore.js'
import useDnsStore from '../store/useDnsStore.js'
import { Link } from 'react-router-dom'

export default function HelpPage() {
  const signal     = useSignalStore(s => s.current)
  const dnsStatus  = useDnsStore(s => s.status)
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'How do I improve my cellular connection speed?',
      a: 'Position your NetSense device near a window or higher elevation away from thick concrete walls. If using external antennas, ensure the SMA connectors are tightly fastened. You can verify technical signal parameters (RSRP/SINR) under Advanced Settings → Cellular.'
    },
    {
      q: 'Why does a specific device show as "Paused"?',
      a: 'A paused device has been restricted by an administrator. Navigate to the Devices page and click "Resume" on the device to restore its internet access.'
    },
    {
      q: 'How do I access files stored on NetSense from another computer?',
      a: 'On Windows, press Win+R and type "\\\\192.168.1.1\\media". On macOS, open Finder, press Cmd+K, and connect to "smb://192.168.1.1/media". Or simply use the web Files page in this interface.'
    },
    {
      q: 'How do I change the Wi-Fi password or local network IP range?',
      a: 'Go to Advanced Settings → Network to configure DHCP address pools, subnet masks, and interface IP bindings.'
    },
    {
      q: 'How do I safely restart the router?',
      a: 'Go to Advanced Settings → System and select "Reboot Device". The router will safely flush storage buffers and restart within 60 seconds.'
    }
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <PageHeader
        title="Help & Diagnostics"
        subtitle="Troubleshooting checklist and diagnostic guidance for NetSense"
      />

      {/* Connection Diagnostic Checklist */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={15} color="var(--color-primary)" />
            <span className="card-title">Automated Connection Checklist</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Live Status Check</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              className="checklist-item"
              style={{
                backgroundColor: signal.connected ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                border: `1px solid ${signal.connected ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                <Radio size={16} color={signal.connected ? 'var(--color-success)' : 'var(--color-danger)'} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>Cellular Modem & SIM Card</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', wordBreak: 'break-word' }}>
                    {signal.connected ? `Modem attached to ${signal.operator} (${signal.technology})` : 'Modem disconnected or SIM card error'}
                  </div>
                </div>
              </div>
              <span className={`badge ${signal.connected ? 'badge-success' : 'badge-danger'}`} style={{ flexShrink: 0 }}>
                {signal.connected ? 'OK' : 'FAIL'}
              </span>
            </div>

            <div
              className="checklist-item"
              style={{
                backgroundColor: dnsStatus.running ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                border: `1px solid ${dnsStatus.running ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                <CheckCircle2 size={16} color={dnsStatus.running ? 'var(--color-success)' : 'var(--color-warning)'} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>DNS Name Resolution</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', wordBreak: 'break-word' }}>
                    {dnsStatus.running ? 'Local DNS cache active and resolving upstream domains' : 'DNS service restarted or initializing'}
                  </div>
                </div>
              </div>
              <span className={`badge ${dnsStatus.running ? 'badge-success' : 'badge-warning'}`} style={{ flexShrink: 0 }}>
                {dnsStatus.running ? 'OK' : 'CHECK'}
              </span>
            </div>

            <div
              className="checklist-item"
              style={{
                backgroundColor: 'var(--color-success-bg)',
                border: '1px solid var(--color-success-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                <Wifi size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>Local Gateway & Routing Engine</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', wordBreak: 'break-word' }}>
                    IPv4 packet forwarding enabled on 192.168.1.1
                  </div>
                </div>
              </div>
              <span className="badge badge-success" style={{ flexShrink: 0 }}>OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Steps */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">Quick Troubleshooting Guide</span>
        </div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div className="info-block" style={{ backgroundColor: '#FAFAFA' }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, color: 'var(--color-primary)' }}>
              1. Check SIM & Signal
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Verify that the cellular SIM card is inserted properly and that the signal bar on the dashboard indicates at least "Fair" or "Good".
            </div>
          </div>

          <div className="info-block" style={{ backgroundColor: '#FAFAFA' }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, color: 'var(--color-primary)' }}>
              2. Flush DNS Cache
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              If websites are failing to load while connected, try clearing stale local domain records in <Link to="/advanced/dns" style={{ color: 'var(--color-primary)' }}>Advanced DNS</Link>.
            </div>
          </div>

          <div className="info-block" style={{ backgroundColor: '#FAFAFA' }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, color: 'var(--color-primary)' }}>
              3. Restart the Device
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              A clean system reboot refreshes all cellular radio states and hardware interfaces without losing saved configurations.
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Frequently Asked Questions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                style={{
                  borderBottom: idx === faqs.length - 1 ? 'none' : '1px solid var(--color-border-subtle)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-text)'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 16px 14px 16px', fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
