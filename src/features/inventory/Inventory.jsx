import { useState, useEffect } from 'react'
import { getAllParts, createPart, deletePart } from './inventoryAPI'

export default function Inventory() {
  const [parts, setParts]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState({
    vendorID: 1, name: '', description: '', category: '',
    partNumber: '', price: '', stock: '', lowStockThreshold: 5,
  })

  async function fetchParts() {
    setLoading(true)
    try   { const res = await getAllParts(); setParts(res.data) }
    catch { setError('Failed to load inventory. Make sure the backend is running.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchParts() }, [])

  async function handleAdd(e) {
    e.preventDefault(); setSaving(true)
    try {
      await createPart({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
      fetchParts()
      setShowModal(false)
      setForm({ vendorID:1, name:'', description:'', category:'', partNumber:'', price:'', stock:'', lowStockThreshold:5 })
    } catch (err) { setError(err.response?.data?.message || 'Failed to create part.') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this part?')) return
    try   { await deletePart(id); fetchParts() }
    catch { setError('Failed to delete.') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parts Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage vehicle parts stock and pricing</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">
          + Add Part
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'TOTAL PARTS', value: parts.length },
          { label: 'LOW STOCK',   value: parts.filter(p => p.isLowStock).length },
          { label: 'ACTIVE',      value: parts.filter(p => p.isActive).length },
        ].map(card => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-400 tracking-wide mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Parts List</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <th className="text-left px-6 py-3">Part Name</th>
              <th className="text-left px-6 py-3">Part #</th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-left px-6 py-3">Price</th>
              <th className="text-left px-6 py-3">Stock</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : parts.length === 0
                ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">No parts found.</td></tr>
                : parts.map(p => (
                  <tr key={p.partID} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{p.partNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">${p.price?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${p.isLowStock ? 'text-red-500' : 'text-green-600'}`}>
                        {p.stock}{p.isLowStock && ' ⚠ Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(p.partID)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Delete</button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">{parts.length} parts total</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Add New Part</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Part Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Part Number</label>
                  <input required value={form.partNumber} onChange={e => setForm({...form, partNumber:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                  <input required value={form.category} onChange={e => setForm({...form, category:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Vendor ID</label>
                  <input required type="number" value={form.vendorID} onChange={e => setForm({...form, vendorID:parseInt(e.target.value)})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Price ($)</label>
                  <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Initial Stock</label>
                  <input required type="number" value={form.stock} onChange={e => setForm({...form, stock:e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Part'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
