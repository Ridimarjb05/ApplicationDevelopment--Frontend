import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

const emptyC = { email: '', password: '', firstName: '', lastName: '', phone: '', address: '', dateOfBirth: '' }
const emptyV = { vehicleNumber: '', make: '', model: '', year: '', color: '', notes: '', vin: '' }

const inp = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#1e293b', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }
const lbl = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }

function Section({ num, title, sub, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{title}</p>
          {sub && <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '1px' }}>{sub}</p>}
        </div>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}

export default function RegisterCustomer() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyC)
  const [vehicles, setVehicles] = useState([])
  const [vForm, setVForm] = useState(emptyV)
  const [showVForm, setShowVForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [vError, setVError] = useState('')

  const hc = e => setForm({ ...form, [e.target.name]: e.target.value })
  const hvc = e => setVForm({ ...vForm, [e.target.name]: e.target.value })

  function addVehicle() {
    if (!vForm.vehicleNumber || !vForm.make || !vForm.model || !vForm.year) { setVError('Plate, make, model and year are required.'); return }
    setVehicles([...vehicles, vForm]); setVForm(emptyV); setShowVForm(false); setVError('')
  }

  async function submit(e) {
    e.preventDefault(); setError(''); setSubmitting(true)
    try {
      const payload = { ...form, dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth + 'T00:00:00Z').toISOString() : form.dateOfBirth }
      const res = await api.post('/customer/register', payload)
      const id = res.data.customerID
      for (const v of vehicles) await api.post(`/customer/${id}/vehicles`, v)
      navigate(`/customers/${id}`)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed.'
      setError(typeof msg === 'string' ? msg : 'Registration failed.')
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Link to="/customers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500, marginBottom: '12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Customers
        </Link>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>Register New Customer</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>Create a customer account with optional vehicle details</p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', padding: '12px 16px', fontSize: '13px', color: '#dc2626', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <Section num="1" title="Personal Information" sub="Basic account and contact details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { name: 'firstName', label: 'First Name', req: true },
              { name: 'lastName', label: 'Last Name', req: true },
              { name: 'email', label: 'Email Address', type: 'email', req: true },
              { name: 'password', label: 'Password', type: 'password', req: true, hint: 'Min. 6 characters' },
              { name: 'phone', label: 'Phone Number', req: true },
              { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', req: true },
            ].map(({ name, label, type = 'text', req, hint }) => (
              <div key={name}>
                <label style={lbl}>{label}{req && <span style={{ color: '#ef4444' }}> *</span>}</label>
                <input type={type} name={name} value={form[name]} onChange={hc} required={req}
                  style={{ ...inp }} onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
                {hint && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{hint}</p>}
              </div>
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={lbl}>Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="address" value={form.address} onChange={hc} required style={{ ...inp }}
                onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }} />
            </div>
          </div>
        </Section>

        <Section num="2" title="Vehicles" sub="Optional — can be added after registration too">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {vehicles.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '9px', border: '1px solid #e8ecf0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{v.make} {v.model} ({v.year})</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{v.vehicleNumber}{v.color ? ` · ${v.color}` : ''}</p>
                </div>
                <button type="button" onClick={() => setVehicles(vehicles.filter((_, j) => j !== i))}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}

            {showVForm ? (
              <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '9px', border: '1px solid #bae6fd', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vError && <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>{vError}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {[
                    { name: 'vehicleNumber', label: 'Plate/Number *' },
                    { name: 'make', label: 'Make *' },
                    { name: 'model', label: 'Model *' },
                    { name: 'year', label: 'Year *' },
                    { name: 'color', label: 'Color' },
                    { name: 'vin', label: 'VIN' },
                  ].map(({ name, label }) => (
                    <div key={name}>
                      <label style={{ ...lbl, color: '#0369a1' }}>{label}</label>
                      <input type="text" name={name} value={vForm[name]} onChange={hvc}
                        style={{ ...inp, background: '#fff', borderColor: '#bae6fd' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ ...lbl, color: '#0369a1' }}>Notes</label>
                  <input type="text" name="notes" value={vForm.notes} onChange={hvc}
                    style={{ ...inp, background: '#fff', borderColor: '#bae6fd' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={addVehicle}
                    style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Confirm Vehicle
                  </button>
                  <button type="button" onClick={() => { setShowVForm(false); setVError('') }}
                    style={{ background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowVForm(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '9px', border: '1.5px dashed #bfdbfe', background: '#f8faff', color: '#2563eb', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Vehicle
              </button>
            )}
          </div>
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
          <Link to="/customers" style={{ padding: '9px 20px', borderRadius: '9px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Cancel</Link>
          <button type="submit" disabled={submitting}
            style={{ padding: '9px 24px', borderRadius: '9px', background: '#2563eb', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: submitting ? 0.7 : 1 }}>
            {submitting && <div style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
            {submitting ? 'Registering...' : 'Register Customer'}
          </button>
        </div>
      </form>
    </div>
  )
}
