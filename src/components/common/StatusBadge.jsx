// StatusBadge — renders a colored badge based on status string or explicit variant
// Usage: <StatusBadge status="online" /> or <StatusBadge variant="success" label="Active" />

const STATUS_MAP = {
  online:       { variant: 'success', label: 'Online'      },
  offline:      { variant: 'danger',  label: 'Offline'     },
  connected:    { variant: 'success', label: 'Connected'   },
  disconnected: { variant: 'danger',  label: 'Disconnected' },
  up:           { variant: 'success', label: 'UP'          },
  down:         { variant: 'danger',  label: 'DOWN'        },
  active:       { variant: 'success', label: 'Active'      },
  inactive:     { variant: 'neutral', label: 'Inactive'    },
  blocked:      { variant: 'danger',  label: 'Blocked'     },
  enabled:      { variant: 'success', label: 'Enabled'     },
  disabled:     { variant: 'neutral', label: 'Disabled'    },
  excellent:    { variant: 'success', label: 'Excellent'   },
  good:         { variant: 'success', label: 'Good'        },
  fair:         { variant: 'warning', label: 'Fair'        },
  poor:         { variant: 'danger',  label: 'Poor'        },
  hit:          { variant: 'success', label: 'HIT'         },
  miss:         { variant: 'neutral', label: 'MISS'        },
  block:        { variant: 'danger',  label: 'BLOCK'       },
  accept:       { variant: 'success', label: 'ACCEPT'      },
  drop:         { variant: 'danger',  label: 'DROP'        },
  reject:       { variant: 'warning', label: 'REJECT'      },
}

export default function StatusBadge({ status, variant, label, dot = false }) {
  const resolved = status
    ? (STATUS_MAP[status.toLowerCase()] || { variant: 'neutral', label: status })
    : { variant: variant || 'neutral', label: label || '—' }

  return (
    <span className={`badge badge-${resolved.variant}`}>
      {dot && <span className="live-dot" style={{ width: 5, height: 5 }} />}
      {label || resolved.label}
    </span>
  )
}
