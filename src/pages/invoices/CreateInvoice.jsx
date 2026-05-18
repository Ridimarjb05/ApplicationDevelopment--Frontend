import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

const empty = { vendorID: '', partID: '', quantityPurchased: '', unitCost: '', notes: '' }
const inp = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#1e293b', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }
const lbl = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }

function SummaryRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
      <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: bold ? '16px' : '13px', fontWeight: bold ? 800 : 500, color: bold ? '#0f172a' : '#1e293b', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{value || '—'}</span>
    </div>
  )
}

export default function CreateInvoice() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [vendors, setVendors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { api.get('/api/vendor?activeOnly=true').then(r => setVendors(r.data)).catch(() => {}) }, [])

  const hc = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const qty = Number(form.quantityPurchased)
  const cost = Number(form.unitCost)
  const total = qty > 0 && cost > 0 ? qty * cost : null
  const selVendor = vendors.find(v => String(v.vendorID) === String(form.vendorID))

  async function submit(e) {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      await api.post('/api/purchaseinvoice', { vendorID: Number(form.vendorID), partID: Number(form.partID), quantityPurchased: qty, unitCost: cost, notes: form.notes })
      navigate('/staff/invoices')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to create invoice.'
      setError(typeof msg === 'string' ? msg : 'Failed to create invoice.')
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Link to="/staff/invoices" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, marginBottom: '12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Invoices
        </Link>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Create Purchase Invoice</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>Record a parts procurement order and update stock automatically</p>
      </div>

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', padding: '12px 16px', fontSize: '13px', color: '#dc2626' }}>
                {error}
              </div>
            )}

            {/* Vendor */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Select Vendor</p>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={lbl}>Vendor <span style={{ color: '#ef4444' }}>*</span></label>
                  <select name="vendorID" value={form.vendorID} onChange={hc} required style={{ ...inp }}>
                    <option value="">Select an active vendor...</option>
                    {vendors.map(v => <option key={v.vendorID} value={v.vendorID}>{v.name}</option>)}
                  </select>
                </div>
                {selVendor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#f0f9ff', borderRadius: '9px', border: '1px solid #bae6fd' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      {selVendor.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{selVendor.name}</p>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{selVendor.contactPerson} · {selVendor.phone}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', color: '#10b981' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Item Details */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#059669', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Item Details</p>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={lbl}>Part ID <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="number" name="partID" value={form.partID} onChange={hc} required min="1" placeholder="Enter numeric part ID"
                    style={inp}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>Enter the numeric ID of the part being purchased</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={lbl}>Quantity <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="number" name="quantityPurchased" value={form.quantityPurchased} onChange={hc} required min="1" placeholder="0"
                      style={inp}
                      onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
                  </div>
                  <div>
                    <label style={lbl}>Unit Cost ($) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="number" name="unitCost" value={form.unitCost} onChange={hc} required min="0.01" step="0.01" placeholder="0.00"
                      style={inp}
                      onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Notes (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={hc} rows={3} placeholder="Additional notes about this purchase..."
                    style={{ ...inp, resize: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Summary */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden', position: 'sticky', top: '20px' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Order Summary</p>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <SummaryRow label="Vendor" value={selVendor?.name} />
              <SummaryRow label="Part ID" value={form.partID ? `#${form.partID}` : ''} />
              <SummaryRow label="Quantity" value={form.quantityPurchased} />
              <SummaryRow label="Unit Cost" value={cost > 0 ? `$${cost.toFixed(2)}` : ''} />
              <div style={{ borderTop: '1.5px solid #f1f5f9', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>Grand Total</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: total != null ? '#2563eb' : '#e2e8f0' }}>
                  {total != null ? `$${total.toFixed(2)}` : '—'}
                </span>
              </div>
            </div>

            <div style={{ margin: '0 16px 14px', padding: '10px 12px', background: '#f0f9ff', borderRadius: '9px', border: '1px solid #bae6fd', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p style={{ fontSize: '11px', color: '#0369a1', lineHeight: 1.5 }}>Submitting this invoice will automatically update the part's stock level.</p>
            </div>

            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button type="submit" disabled={submitting}
                style={{ width: '100%', padding: '11px', borderRadius: '9px', background: '#2563eb', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: submitting ? 0.7 : 1 }}>
                {submitting && <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                {submitting ? 'Creating...' : 'Submit Purchase Order'}
              </button>
              <Link to="/staff/invoices" style={{ display: 'block', width: '100%', padding: '10px', borderRadius: '9px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '13px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}>
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}