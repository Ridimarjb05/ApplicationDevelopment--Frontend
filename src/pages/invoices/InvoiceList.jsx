import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([])
  const [vendors, setVendors] = useState([])
  const [vendorFilter, setVendorFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/purchaseinvoice'), api.get('/vendor')])
      .then(([inv, vnd]) => { setInvoices(inv.data); setVendors(vnd.data) })
      .catch(() => setError('Failed to load invoices.'))
      .finally(() => setLoading(false))
  }, [])

  const vendorMap = Object.fromEntries(vendors.map(v => [v.vendorID, v.name]))
  const filtered = vendorFilter ? invoices.filter(i => String(i.vendorID) === vendorFilter) : invoices
  const totalSpent = filtered.reduce((s, i) => s + Number(i.totalCost ?? 0), 0)
  const totalQty = filtered.reduce((s, i) => s + Number(i.quantityPurchased ?? 0), 0)

  return (
    <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Purchase Invoices</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>Parts procurement records and stock updates</p>
        </div>
        <Link to="/invoices/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Invoice
        </Link>
      </div>

      {/* Stats */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
          {[
            { label: 'Total Invoices', value: filtered.length, color: '#2563eb', borderColor: '#3b82f6', sub: vendorFilter ? `From ${vendorMap[Number(vendorFilter)] ?? 'vendor'}` : 'All vendors' },
            { label: 'Total Spent', value: `$${totalSpent.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}`, color: '#059669', borderColor: '#10b981', sub: 'Procurement cost' },
            { label: 'Units Purchased', value: totalQty.toLocaleString(), color: '#d97706', borderColor: '#f59e0b', sub: 'Total stock added' },
          ].map(({ label, value, color, borderColor, sub }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf0', borderLeft: `4px solid ${borderColor}`, padding: '16px 18px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ fontSize: '26px', fontWeight: 800, color, marginTop: '6px', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            Invoice Records
            {!loading && <span style={{ marginLeft: '8px', background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 600, padding: '1px 8px', borderRadius: '10px' }}>{filtered.length}</span>}
          </p>
          <div style={{ marginLeft: 'auto' }}>
            <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#475569', outline: 'none' }}>
              <option value="">All Vendors</option>
              {vendors.map(v => <option key={v.vendorID} value={v.vendorID}>{v.name}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
            <div style={{ width: '26px', height: '26px', border: '2px solid #e2e8f0', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>No invoices found</p>
            <Link to="/invoices/create" style={{ display: 'inline-block', marginTop: '8px', fontSize: '13px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Create your first invoice →</Link>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr>
                    {['Invoice', 'Vendor', 'Part ID', 'Qty', 'Unit Cost', 'Total Cost', 'Stock After', 'Date'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e8ecf0', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv, i) => (
                    <tr key={inv.purchaseInvoiceID} style={{ borderBottom: '1px solid #f1f5f9' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: 700 }}>#{inv.purchaseInvoiceID}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{vendorMap[inv.vendorID] ?? `Vendor #${inv.vendorID}`}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 7px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>#{inv.partID}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>{inv.quantityPurchased}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>${Number(inv.unitCost).toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>${Number(inv.totalCost).toFixed(2)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {inv.updatedStockLevel != null
                          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px' }}>↑ {inv.updatedStockLevel}</span>
                          : <span style={{ color: '#cbd5e1' }}>—</span>
                        }
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(inv.purchasedAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Showing {filtered.length} of {invoices.length} invoices</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>Total: ${totalSpent.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
