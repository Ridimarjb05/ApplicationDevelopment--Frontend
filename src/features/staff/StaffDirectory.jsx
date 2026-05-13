import { useState, useEffect } from 'react'
import { getAllStaff, createStaff, deleteStaff } from './staffAPI'

const ROLE_STYLES = {
  Administrator:      { color: 'text-purple-700', bg: 'bg-purple-100' },
  'Inventory Manager':{ color: 'text-blue-700',   bg: 'bg-blue-100'   },
  'Sales Rep':        { color: 'text-sky-700',    bg: 'bg-sky-100'    },
  Mechanic:           { color: 'text-orange-700', bg: 'bg-orange-100' },
}

export default function StaffDirectory() {
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ firstName:'', lastName:'', email:'', password:'', phone:'', position:'Mechanic' })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  async function fetchStaff() {
    setLoading(true)
    try   { const res = await getAllStaff(); setStaffList(res.data) }
    catch { setError('Failed to load staff. Make sure the backend is running.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStaff() }, [])

  async function handleAdd(e) {
    e.preventDefault(); setSaving(true)
    try {
      await createStaff({ ...form, address: 'N/A', hireDate: new Date().toISOString() })
      fetchStaff()
      setShowModal(false)
      setForm({ firstName:'', lastName:'', email:'', password:'', phone:'', position:'Mechanic' })
    } catch (err) { setError(err.response?.data?.message || 'Failed to create staff.') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this staff member?')) return
    try   { await deleteStaff(id); fetchStaff() }
    catch { setError('Failed to delete.') }
  }

  const filtered = staffList.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Registry</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage roles and registration status</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">
          + Register New Staff
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'TOTAL STAFF', value: staffList.length },
          { label: 'ACTIVE',      value: staffList.filter(s => s.status === 'Active').length },
          { label: 'MECHANICS',   value: staffList.filter(s => s.position === 'Mechanic').length },
          { label: 'MANAGERS',    value: staffList.filter(s => s.position === 'Inventory Manager').length },
        ].map(card => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-400 tracking-wide mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Staff Directory</h3>
          <input type="text" placeholder="Search name or email…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Role</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={5} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : filtered.length === 0
                ? <tr><td colSpan={5} className="text-center py-10 text-slate-400">No staff found.</td></tr>
                : filtered.map(s => {
                    const style = ROLE_STYLES[s.position] || { color:'text-slate-700', bg:'bg-slate-100' }
                    const name  = `${s.firstName} ${s.lastName}`.trim()
                    const ini   = name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
                    return (
                      <tr key={s.staffID} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">{ini}</div>
                            <div>
                              <p className="font-semibold text-slate-900">{name}</p>
                              <p className="text-xs text-slate-400">ID: #PA-{1000 + s.staffID}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{s.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.color}`}>{s.position}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${s.status === 'Active' ? 'text-green-600' : 'text-amber-500'}`}>
                            ● {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(s.staffID)}
                            className="text-red-400 hover:text-red-600 text-xs font-semibold">Delete</button>
                        </td>
                      </tr>
                    )
                  })
            }
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {staffList.length} staff
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Register New Staff</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">First Name</label>
                  <input required value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Last Name</label>
                  <input value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
                <input required value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Staff@123" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Position</label>
                  <select value={form.position} onChange={e => setForm({...form, position:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Administrator</option><option>Inventory Manager</option>
                    <option>Sales Rep</option><option>Mechanic</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
