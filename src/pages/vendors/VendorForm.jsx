import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../services/api'

const empty = { name: '', contactPerson: '', phone: '', email: '', address: '', isActive: true }
const inp = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#1e293b', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }
const lbl = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }

export default function VendorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get(`/api/vendor/${id}`)
      .then(r => {
        const v = r.data
        setForm({ name: v.name ?? '', contactPerson: v.contactPerson ?? '', phone: v.phone ?? '', email: v.email ?? '', address: v.address ?? '', isActive: v.isActive ?? true })
      })
      .catch(() => setError('Failed to load vendor.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const hc = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submit(e) {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      if (isEdit) await api.put(`/api/vendor/${id}`, form)
      else await api.post('/api/vendor', form)
      navigate('/staff/vendors')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to save.'
      setError(typeof msg === 'string' ? msg : 'Failed to save.')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}><div style={{ width: '26px', height: '26px', border: '2px solid #e2e8f0', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>

  return (
    <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Link to="/staff/vendors" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, marginBottom: '12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Vendors
        </Link>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>{isEdit ? 'Update the supplier details' : 'Register a new parts supplier to your network'}</p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Vendor Information</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>All fields marked * are required</p>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <div>
              <label style={lbl}>Vendor Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="name" value={form.name} onChange={hc} required style={inp}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
            </div>

            <div>
              <label style={lbl}>Contact Person <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="contactPerson" value={form.contactPerson} onChange={hc} required style={inp}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lbl}>Phone <span style={{ color: '#ef4444' }}>*</span></label>
                <input name="phone" value={form.phone} onChange={hc} required style={inp}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
              </div>
              <div>
                <label style={lbl}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="email" name="email" value={form.email} onChange={hc} required style={inp}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
              </div>
            </div>

            <div>
              <label style={lbl}>Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="address" value={form.address} onChange={hc} required style={inp}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
            </div>

            {isEdit && (
              <div style={{ paddingTop: '4px' }}>
                <p style={lbl}>Vendor Status</p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                  <div onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                    style={{ width: '42px', height: '24px', borderRadius: '12px', background: form.isActive ? '#2563eb' : '#e2e8f0', display: 'flex', alignItems: 'center', padding: '2px', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transform: form.isActive ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{form.isActive ? 'Active' : 'Inactive'}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{form.isActive ? 'Visible for invoice creation' : 'Hidden from invoice creation'}</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Link to="/staff/vendors" style={{ padding: '9px 20px', borderRadius: '9px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Cancel</Link>
            <button type="submit" disabled={submitting}
              style={{ padding: '9px 24px', borderRadius: '9px', background: '#2563eb', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: submitting ? 0.7 : 1 }}>
              {submitting && <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
              {submitting ? 'Saving...' : isEdit ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}