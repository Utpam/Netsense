// StatusBadge — renders sharp, compact status badge matching NetSense theme

const STATUS_MAP = {
  online:       { variant: 'success', label: 'Online'      },
  offline:      { variant: 'neutral', label: 'Offline'     },
  connected:    { variant: 'success', label: 'Connected'   },
  disconnected: { variant: 'danger',  label: 'Disconnected' },
  running:      { variant: 'success', label: 'Running'     },
  stopped:      { variant: 'neutral', label: 'Stopped'     },
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
  warning:      { variant: 'warning', label: 'Warning'     },
  error:        { variant: 'danger',  label: 'Error'       },
  hit:          { variant: 'success', label: 'HIT'         },
  miss:         { variant: 'neutral', label: 'MISS'        },
  block:        { variant: 'danger',  label: 'BLOCK'       },
  accept:       { variant: 'success', label: 'ACCEPT'      },
  drop:         { variant: 'danger',  label: 'DROP'        },
  reject:       { variant: 'warning', label: 'REJECT'      },
}

export default function StatusBadge({ status, variant, label, dot = true, className = '' }) {
  const resolved = status
    ? (STATUS_MAP[status.toString().toLowerCase()] || { variant: 'neutral', label: status })
    : { variant: variant || 'neutral', label: label || '—' }

  return (
    <span className={`badge badge-${resolved.variant} ${className}`}>
      {dot && <span className="badge-dot" />}
      {label || resolved.label}
    </span>
  )
}
