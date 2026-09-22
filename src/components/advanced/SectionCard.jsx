import { useState } from 'react'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'

export default function SectionCard({
  title,
  subtitle,
  badge,
  actions,
  children,
  configureContent,
  configureLabel = 'Configure',
  defaultExpanded = false
}) {
  const [showConfig, setShowConfig] = useState(defaultExpanded)

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="card-title">{title}</span>
              {badge}
            </div>
            {subtitle && (
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{subtitle}</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {actions}
          {configureContent && (
            <button
              className={`btn ${showConfig ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings size={12} />
              {showConfig ? 'Hide Configuration' : configureLabel}
              {showConfig ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      <div className="card-body">
        {children}

        {showConfig && configureContent && (
          <div style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: '#FAFAFA',
            margin: '16px -16px -16px -16px',
            padding: '16px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Settings size={13} color="var(--color-primary)" />
              {title} Configuration
            </div>
            {configureContent}
          </div>
        )}
      </div>
    </div>
  )
}
