import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import { HelpCircle, ChevronDown, ChevronRight, RefreshCw, Wifi } from 'lucide-react'

const STEPS = [
  {
    title: 'No internet connection',
    steps: [
      'Check that the SkyLink device is powered on (LED should be blue/green).',
      'Verify the SIM card is inserted correctly and has an active data plan.',
      'Check the signal indicator below — if signal is poor, try relocating the device or adjusting the antenna.',
      'Try restarting your device (phone/laptop) and reconnecting to the SkyLink Wi-Fi.',
      'If the issue persists, contact your administrator.',
    ],
  },
  {
    title: 'Slow internet speed',
    steps: [
      'Check the signal quality on the Signal page — poor signal will reduce speeds.',
      'Check if many devices are connected and consuming bandwidth (Devices page).',
      'QoS rules may be limiting your device\'s speed — check with the administrator.',
      'Peak usage times (evenings, weekends) may cause network congestion.',
      'Try connecting closer to the SkyLink device for stronger Wi-Fi signal.',
    ],
  },
  {
    title: 'Cannot connect to SkyLink Wi-Fi',
    steps: [
      'Make sure you are connecting to the correct Wi-Fi network (SSID: SkyLink).',
      'Verify you are using the correct Wi-Fi password.',
      'Forget the network on your device and try reconnecting.',
      'Ensure you are within range of the SkyLink device.',
      'Check if your device is blocked on the Devices page.',
    ],
  },
  {
    title: 'File server not accessible',
    steps: [
      'Verify the file server is running (Services page — File Server should show Active).',
      'On Windows: open File Explorer and type \\\\skylink.local or \\\\192.168.1.1 in the address bar.',
      'On macOS: Finder → Go → Connect to Server → smb://skylink.local',
      'Ensure your device is connected to the SkyLink network, not a mobile data connection.',
      'Contact the administrator if you need access credentials.',
    ],
  },
]

export default function ClientTroubleshoot() {
  const [open, setOpen] = useState(null)

  return (
    <div>
      <PageHeader
        title="Troubleshooting"
        subtitle="Common issues and solutions for your SkyLink connection"
      />

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 16px' }}>
        <div style={{ fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Wifi size={15} color="var(--color-primary)" />
          Quick Checks
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={13} />
            Refresh Connection
          </button>
          <a href="/client/signal" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            Check Signal Quality →
          </a>
          <a href="/client/devices" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            View Connected Devices →
          </a>
        </div>
      </div>

      {/* FAQ accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map((item, i) => (
          <div key={i} className="card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text)', font: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HelpCircle size={15} color="var(--color-primary)" />
                {item.title}
              </span>
              {open === i ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            {open === i && (
              <div style={{ padding: '0 16px 16px' }}>
                <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {item.steps.map((step, j) => (
                    <li key={j} style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
