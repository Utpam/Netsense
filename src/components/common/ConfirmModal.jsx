import { X, AlertTriangle } from 'lucide-react'

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} color={`var(--color-${variant === 'danger' ? 'danger' : 'warning'})`} />
            {title}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} style={{ padding: 4 }}>
            <X size={14} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn btn-${variant} btn-sm`}
            onClick={() => {
              onConfirm()
              onCancel()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
