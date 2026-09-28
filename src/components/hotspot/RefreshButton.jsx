import { RefreshCw } from 'lucide-react'

/**
 * RefreshButton
 * Subtle, accessible button with a smooth spin animation while refreshing.
 */
export default function RefreshButton({ onRefresh, isRefreshing, disabled }) {
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={onRefresh}
      disabled={disabled || isRefreshing}
      aria-label="Refresh hotspot data"
      title="Refresh hotspot status and connected devices"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minHeight: 32,
      }}
    >
      <RefreshCw
        size={13}
        className={isRefreshing ? 'spin-animation' : ''}
        style={{
          transition: 'transform 0.3s ease',
          animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
        }}
      />
      <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
    </button>
  )
}
