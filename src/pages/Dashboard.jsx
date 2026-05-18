import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const C = {
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', padding: '20px' },
  label: { fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' },
  val: { fontSize: '32px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: '8px' },
  sub: { fontSize: '12px', color: '#94a3b8', marginTop: '6px' },
  th: { padding: '10px 16px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e8ecf0' },
  td: { padding: '13px 16px', fontSize: '13px', color: '#475569', borderBottom: '1px solid #f1f5f9' },
}

function KpiCard({ label, value, sub, iconBg, iconColor, icon, accentColor }) {
  return (
    <div style={{ ...C.card, borderTop: `3px solid ${accentColor}`, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={C.label}>{label}</p>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <p style={C.val}>{value}</p>
      <p style={C.sub}>{sub}</p>
    </div>
  )
}

export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [vendors, setVendors] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/customer'), api.get('/vendor'), api.get('/purchaseinvoice')])
      .then(([c, v, i]) => { setCustomers(c.data); setVendors(v.data); setInvoices(i.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeVendors = vendors.filter(v => v.isActive).length
  const totalSpent = invoices.reduce((s, i) => s + Number(i.totalCost ?? 0), 0)
  const vendorMap = Object.fromEntries(vendors.map(v => [v.vendorID, v.name]))
  const recent = [...invoices].reverse().slice(0, 6)

  const kpis = [
    { label: 'Total Customers', value: loading ? '—' : customers.length, sub: 'Registered accounts', accentColor: '#3b82f6', iconBg: '#eff6ff', iconColor: '#2563eb', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Active Vendors', value: loading ? '—' : activeVendors, sub: `${vendors.length} total in network`, accentColor: '#10b981', iconBg: '#ecfdf5', iconColor: '#059669', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: 'Total Invoices', value: loading ? '—' : invoices.length, sub: 'Purchase orders placed', accentColor: '#8b5cf6', iconBg: '#f5f3ff', iconColor: '#7c3aed', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { label: 'Total Procurement', value: loading ? '—' : `$${totalSpent.toLocaleString('en',{maximumFractionDigits:0})}`, sub: 'Across all invoices', accentColor: '#f59e0b', iconBg: '#fffbeb', iconColor: '#d97706', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  ]

  return (
    <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/invoices/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Invoice
        </Link>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Main content area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>
        {/* Recent invoices */}
        <div style={{ ...C.card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Recent Purchase Invoices</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Latest procurement activity</p>
            </div>
            <Link to="/invoices" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px' }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid #e2e8f0', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: '13px' }}>No invoices yet. <Link to="/invoices/create" style={{ color: '#2563eb' }}>Create one →</Link></div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Invoice #', 'Vendor', 'Part ID', 'Qty', 'Total', 'Date'].map(h => <th key={h} style={C.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {recent.map((inv, i) => (
                  <tr key={inv.purchaseInvoiceID} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={C.td}><span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: 700 }}>#{inv.purchaseInvoiceID}</span></td>
                    <td style={{ ...C.td, fontWeight: 600, color: '#1e293b' }}>{vendorMap[inv.vendorID] ?? `Vendor #${inv.vendorID}`}</td>
                    <td style={C.td}><span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>#{inv.partID}</span></td>
                    <td style={C.td}>{inv.quantityPurchased}</td>
                    <td style={{ ...C.td, fontWeight: 700, color: '#0f172a' }}>${Number(inv.totalCost).toFixed(2)}</td>
                    <td style={C.td}>{new Date(inv.purchasedAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</p>
          {[
            { to: '/customers/register', label: 'Register Customer', desc: 'Add a new customer account', color: '#2563eb', bg: '#eff6ff' },
            { to: '/vendors/new', label: 'Add Vendor', desc: 'Register a new supplier', color: '#059669', bg: '#ecfdf5' },
            { to: '/invoices/create', label: 'Create Invoice', desc: 'Record a purchase order', color: '#d97706', bg: '#fffbeb' },
            { to: '/customers', label: 'View All Customers', desc: 'Browse customer directory', color: '#7c3aed', bg: '#f5f3ff' },
          ].map(({ to, label, desc, color, bg }) => (
            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 14px', background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf0', textDecoration: 'none', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.09)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{label}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
