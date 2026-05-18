import { useState } from 'react'
import { createInvoice } from './invoiceAPI'

const EMPTY_ITEM = { partID: '', quantity: 1 }

export default function CreateInvoice() {
  const [form, setForm] = useState({
    customerID: '',
    staffID: '',
    type: 'Sale',
    isCreditSale: false,
    dueDate: '',
    notes: '',
  })
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  // Update main form fields
  function handleFormChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Update a specific item row
  function handleItemChange(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  // Add new item row
  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }])
  }

  // Remove item row
  function removeItem(index) {
    if (items.length === 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(null)
    setSaving(true)
    try {
      const payload = {
        customerID: parseInt(form.customerID),
        staffID: parseInt(form.staffID),
        type: form.type,
        isCreditSale: form.isCreditSale,
        dueDate: form.isCreditSale && form.dueDate ? form.dueDate : null,
        notes: form.notes,
        items: items.map((item) => ({
          partID: parseInt(item.partID),
          quantity: parseInt(item.quantity),
        })),
      }
      const res = await createInvoice(payload)
      setSuccess(res.data)
      setForm({ customerID: '', staffID: '', type: 'Sale', isCreditSale: false, dueDate: '', notes: '' })
      setItems([{ ...EMPTY_ITEM }])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Sale Invoice</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Sell vehicle parts and generate invoice for customer
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-green-700 font-semibold text-sm mb-3">
            ✅ Invoice #{success.invoiceID} created successfully!
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
            <p><span className="font-medium">Customer:</span> {success.customerName}</p>
            <p><span className="font-medium">Staff:</span> {success.staffName}</p>
            <p><span className="font-medium">Subtotal:</span> Rs. {success.subTotal?.toFixed(2)}</p>
            <p><span className="font-medium">Discount:</span> Rs. {success.discountAmount?.toFixed(2)}</p>
            <p><span className="font-medium">Total:</span> Rs. {success.totalAmount?.toFixed(2)}</p>
            <p><span className="font-medium">Paid:</span> {success.isPaid ? 'Yes' : 'No (Credit)'}</p>
          </div>
          {success.loyaltyDiscountApplied && (
            <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-semibold">
              🎉 10% Loyalty Discount Applied! Customer saved Rs. {success.discountAmount?.toFixed(2)}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="col-span-2 space-y-5">
          {/* Customer & Staff */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Customer ID
                </label>
                <input
                  required
                  type="number"
                  name="customerID"
                  value={form.customerID}
                  onChange={handleFormChange}
                  placeholder="e.g. 1"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Staff ID
                </label>
                <input
                  required
                  type="number"
                  name="staffID"
                  value={form.staffID}
                  onChange={handleFormChange}
                  placeholder="e.g. 1"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Invoice Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Sale">Sale</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Optional notes"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Credit Sale */}
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="isCreditSale"
                name="isCreditSale"
                checked={form.isCreditSale}
                onChange={handleFormChange}
                className="w-4 h-4 accent-slate-900"
              />
              <label htmlFor="isCreditSale" className="text-sm font-medium text-slate-700">
                Credit Sale
              </label>
            </div>

            {/* Due Date - only if credit sale */}
            {form.isCreditSale && (
              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleFormChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Parts Items */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Parts / Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                + Add Part
              </button>
            </div>

            <div className="space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">
                <span className="col-span-6">Part ID</span>
                <span className="col-span-4">Quantity</span>
                <span className="col-span-2"></span>
              </div>

              {/* Item Rows */}
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    required
                    type="number"
                    value={item.partID}
                    onChange={(e) => handleItemChange(index, 'partID', e.target.value)}
                    placeholder="Part ID"
                    className="col-span-6 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    required
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="col-span-4 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="col-span-2 text-red-400 hover:text-red-600 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="space-y-5">
          {/* Loyalty Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-900 mb-2">🎁 Loyalty Discount</h3>
            <p className="text-blue-700 text-xs leading-relaxed">
              Customers automatically get a <strong>10% discount</strong> when their
              subtotal exceeds <strong>Rs. 5,000</strong>. The discount is applied
              automatically when creating the invoice.
            </p>
          </div>

          {/* Submit */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Ready to Invoice?</h3>
            <p className="text-slate-500 text-xs mb-4">
              Review the details and click below to generate the invoice.
            </p>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Creating Invoice…' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}