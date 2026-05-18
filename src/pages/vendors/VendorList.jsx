import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function VendorList() {
  const [vendors, setVendors] = useState([])
  const [activeOnly, setActiveOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  function load(only = activeOnly) {
    setLoading(true)
    api.get(`/vendor?activeOnly=${only}`)
      .then(r => setVendors(r.data))
      .catch(() => setError('Failed to load vendors.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function deactivate(id, name) {
    if (!window.confirm(`Deactivate "${name}"?`)) return
    setDeletingId(id)
    try {
      await api.delete(`/vendor/${id}`)
      setVendors(vs => vs.map(v => v.vendorID === id ? { ...v, isActive: false } : v))
    } catch { alert('Failed to deactivate.') }
    finally { setDeletingId(null) }
  }

  const filtered = vendors.filter(v => {
    const q = search.toLowerCase()
    return !q || v.name?.toLowerCase().includes(q) || v.contactPerson?.toLowerCase().includes(q) || v.email?.toLowerCase().includes(q)
  })

  const active = vendors.filter(v => v.isActive).length

  return (
    <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Vendors</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>Manage your parts suppliers and procurement network</p>
        </div>
        <Link to="/vendors/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vendor
        </Link>
      </div>

      {/* Stats */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
          {[
            { label: 'Total Vendors', value: vendors.length, color: '#2563eb', borderColor: '#3b82f6' },
            { label: 'Active', value: active, color: '#059669', borderColor: '#10b981' },
            { label: 'Inactive', value: vendors.length - active, color: '#dc2626', borderColor: '#ef4444' },
          ].map(({ label, value, color, borderColor }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf0', borderLeft: `4px solid ${borderColor}`, padding: '16px 18px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color, marginTop: '6px', lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
              style={{ paddingLeft: '30px', paddingRight: '12px', height: '34px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#475569', outline: 'none', width: '220px' }} />
          </div>

          {/* Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            <div onClick={() => { const v = !activeOnly; setActiveOnly(v); load(v) }}
              style={{ width: '38px', height: '22px', borderRadius: '11px', background: activeOnly ? '#2563eb' : '#e2e8f0', display: 'flex', alignItems: 'center', padding: '2px', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transform: activeOnly ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </div>
            Active only
          </label>

          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
            {!loading && `${filtered.length} vendor${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
            <div style={{ width: '26px', height: '26px', border: '2px solid #e2e8f0', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>No vendors found</p>
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Vendor', 'Contact Person', 'Phone', 'Email', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e8ecf0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={v.vendorID} style={{ borderBottom: '1px solid #f1f5f9', opacity: v.isActive ? 1 : 0.55 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                          {v.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{v.name}</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>VEND-{String(v.vendorID).padStart(3,'0')}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{v.contactPerson}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{v.phone}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>{v.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {v.isActive
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />Active</span>
                        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />Inactive</span>
                      }
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/vendors/${v.vendorID}/edit`} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textDecoration: 'none' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        {v.isActive && (
                          <button onClick={() => deactivate(v.vendorID, v.name)} disabled={deletingId === v.vendorID}
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #fecaca', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer' }}>
                            {deletingId === v.vendorID
                              ? <div style={{ width: '10px', height: '10px', border: '1.5px solid #fca5a5', borderTop: '1.5px solid #ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            }
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Showing {filtered.length} of {vendors.length} vendors</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
