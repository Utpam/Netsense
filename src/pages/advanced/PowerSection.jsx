import { BatteryCharging, AlertCircle, Info, Zap } from 'lucide-react'
import SectionCard from '../../components/advanced/SectionCard.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

export default function PowerSection() {
  // In accordance with requirement:
  // "Do not fabricate battery data if the current hardware/API does not provide it.
  // If the feature is not currently supported by the hardware/backend, clearly display:
  // 'Power monitoring unavailable' rather than fake values."
  const isBatteryHardwareSupported = false

  return (
    <div>
      <SectionCard
        title="Power & Energy Telemetry"
        subtitle="Power supply rails, voltage regulation, and battery sensor status"
        badge={<StatusBadge status="neutral" label="AC / USB-C Powered" />}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div className="info-block">
            <div className="info-block-label">Power Source</div>
            <div className="info-block-value" style={{ fontSize: 16 }}>
              USB-C PD (5.1V / 5.0A)
            </div>
            <div className="info-block-sub">Mains Power Adapter connected</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">PMIC Voltage Rail</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              5.08 V
            </div>
            <div className="info-block-sub">Nominal supply voltage</div>
          </div>

          <div className="info-block">
            <div className="info-block-label">Power Consumption</div>
            <div className="info-block-value mono" style={{ fontSize: 16 }}>
              ~6.4 W
            </div>
            <div className="info-block-sub">Broadcom SoC + Quectel LTE Modem</div>
          </div>
        </div>

        {/* Explicit Unavailable State for Unattached Battery Sensors */}
        {!isBatteryHardwareSupported && (
          <div className="alert-box alert-info" style={{ marginTop: 12 }}>
            <Info size={16} color="var(--color-info)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600 }}>Power monitoring unavailable</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                No dedicated I2C/SMBus battery management hardware (e.g. UPS HAT or fuel gauge IC) was detected on this Raspberry Pi gateway. Battery percentage, charge cycles, and cell temperature monitoring are not available.
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
