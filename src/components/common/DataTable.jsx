import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'

// DataTable — Sortable, filterable router-admin table
export default function DataTable({
  columns,
  rows = [],
  searchable = false,
  searchKeys,
  emptyText = 'No data available',
  rowKey = 'id',
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [query, setQuery]     = useState('')

  const filtered = useMemo(() => {
    if (!query || !searchable) return rows
    const q = query.toLowerCase()
    const keys = searchKeys || columns.map(c => c.key)
    return rows.filter(row =>
      keys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
    )
  }, [rows, query, searchable, searchKeys, columns])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      if (typeof av === 'number') return sortAsc ? av - bv : bv - av
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
  }, [filtered, sortKey, sortAsc])

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  return (
    <div className="table-container">
      {searchable && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
          <div style={{ position: 'relative', maxWidth: 260 }}>
            <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              className="form-input"
              style={{ width: '100%', paddingLeft: 28, fontSize: 11 }}
              placeholder="Search / filter entries…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="router-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ textAlign: col.align || 'left', cursor: col.sortable !== false ? 'pointer' : 'default', userSelect: 'none' }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {sortKey === col.key && (
                      sortAsc
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '24px 12px' }}>
                  {emptyText}
                </td>
              </tr>
            ) : sorted.map((row, idx) => (
              <tr key={row[rowKey] ?? idx}>
                {columns.map(col => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }} className={col.mono ? 'mono' : ''}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
