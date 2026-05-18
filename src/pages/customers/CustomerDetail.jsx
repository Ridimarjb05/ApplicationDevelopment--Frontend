import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

const emptyV = { vehicleNumber: '', make: '', model: '', year: '', color: '', notes: '', vin: '' }

function Field({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}

export default function CustomerDetail() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [vForm, setVForm] = useState(emptyV)
  const [adding, setAdding] = useState(false)
  const [vError, setVError] = useState('')

  useEffect(() => {
    Promise.all([api.get(`/customer/${id}`), api.get(`/customer/${id}/vehicles`)])
      .then(([c, v]) => { setCustomer(c.data); setVehicles(v.data) })
      .catch(() => setError('Customer not found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function addVehicle(e) {
    e.preventDefault()
    setVError('')
    if (!vForm.vehicleNumber || !vForm.make || !vForm.model || !vForm.year) { setVError('Plate, make, model and year are required.'); return }
    setAdding(true)
    try {
      const res = await api.post(`/customer/${id}/vehicles`, vForm)
      setVehicles([...vehicles, res.data])
      setVForm(emptyV); setShowForm(false)
    } catch { setVError('Failed to add vehicle.') }
    finally { setAdding(false) }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}><div style={{ width: '28px', height: '28px', border: '2px solid #e2e8f0', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: '14px', color: '#ef4444', fontWeight: 500, marginBottom: '12px' }}>{error}</p>
      <Link to="/customers" style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>← Back to Customers</Link>
    </div>
  )

  const initials = `${customer.firstName?.[0] ?? ''}${customer.lastName?.[0] ?? ''}`

  return (
    <div style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back */}
      <Link to="/customers" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Customers
      </Link>

      {/* Profile Header Card */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)', padding: '28px 28px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, color: '#fff', flexShrink: 0, backdropFilter: 'blur(10px)' }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{customer.firstName} {customer.lastName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />Active Customer
                </span>
                {customer.creditStatus && (
                  <span style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.3)' }}>
                    {customer.creditStatus}
                  </span>
                )}
                {customer.registeredAt && (
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                    Customer since {new Date(customer.registeredAt).toLocaleDateString('en-GB', { month:'short', year:'numeric' })}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link to="/customers" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                ← All Customers
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid #f1f5f9' }}>
          {[
            { label: 'Total Spent', value: `$${Number(customer.totalSpent ?? 0).toFixed(2)}`, color: '#2563eb' },
            { label: 'Loyalty Points', value: (customer.loyaltyPoints ?? 0).toLocaleString(), color: '#d97706' },
            { label: 'Registered Vehicles', value: vehicles.length, color: '#059669' },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{ padding: '16px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <p style={{ fontSize: '24px', fontWeight: 800, color, marginTop: '4px' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', alignItems: 'start' }}>
        {/* Contact Info */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Contact Information</p>
          </div>
          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Email Address', icon: '✉', value: customer.email },
              { label: 'Phone Number', icon: '📞', value: customer.phone },
              { label: 'Address', icon: '📍', value: customer.address },
              { label: 'Date of Birth', icon: '🎂', value: customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' }) : null },
            ].map(({ label, value }) => (
              <Field key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        {/* Vehicles */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Registered Vehicles</p>
              <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 600, padding: '1px 7px', borderRadius: '10px' }}>{vehicles.length}</span>
            </div>
            <button onClick={() => { setShowForm(!showForm); setVError('') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: showForm ? '#ef4444' : '#2563eb', background: showForm ? '#fef2f2' : '#eff6ff', padding: '5px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer' }}>
              {showForm ? '✕ Cancel' : '+ Add Vehicle'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={addVehicle} style={{ padding: '16px 18px', background: '#f8faff', borderBottom: '1px solid #e8ecf0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vError && <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>{vError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { name: 'vehicleNumber', label: 'Plate/Number *' },
                  { name: 'make', label: 'Make *' },
                  { name: 'model', label: 'Model *' },
                  { name: 'year', label: 'Year *' },
                  { name: 'color', label: 'Color' },
                  { name: 'vin', label: 'VIN' },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{label}</label>
                    <input type="text" name={name} value={vForm[name]}
                      onChange={e => setVForm({ ...vForm, [e.target.name]: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>Notes</label>
                <input type="text" name="notes" value={vForm.notes} onChange={e => setVForm({ ...vForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff' }} />
              </div>
              <button type="submit" disabled={adding} style={{ alignSelf: 'flex-start', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {adding && <div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                {adding ? 'Adding...' : 'Add Vehicle'}
              </button>
            </form>
          )}

          {vehicles.length === 0 && !showForm ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 10px', display: 'block', opacity: 0.5 }}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <p style={{ fontSize: '13px', fontWeight: 500 }}>No vehicles registered yet</p>
            </div>
          ) : (
            <div>
              {vehicles.map((v, i) => (
                <div key={v.vehicleID ?? i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: i < vehicles.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                      {v.make} {v.model}
                      <span style={{ marginLeft: '6px', background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 500, padding: '1px 6px', borderRadius: '4px' }}>{v.year}</span>
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {v.vehicleNumber}{v.color ? ` · ${v.color}` : ''}{v.vin ? ` · VIN: ${v.vin}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
