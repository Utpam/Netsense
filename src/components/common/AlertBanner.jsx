import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

export default function AlertBanner({ type = 'success', message, action, onDismiss }) {
  const icons = {
    success: <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />,
    warning: <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0 }} />,
    danger:  <AlertCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0 }} />,
    info:    <Info size={16} color="var(--color-info)" style={{ flexShrink: 0 }} />,
  }

  return (
    <div className={`alert-box alert-${type}`}>
      {icons[type] || icons.info}
      <div style={{ flex: 1, fontWeight: 500 }}>
        {message}
      </div>
      {action && (
        <div>{action}</div>
      )}
      {onDismiss && (
        <button
          className="btn btn-ghost btn-sm"
          onClick={onDismiss}
          style={{ padding: 2, color: 'inherit' }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
