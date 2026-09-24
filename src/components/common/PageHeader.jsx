export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header-row">
      <div style={{ minWidth: 0 }}>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="btn-row" style={{ flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  )
}
