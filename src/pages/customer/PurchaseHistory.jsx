import { useState } from 'react'
import { getFullHistory } from './historyAPI'

export default function PurchaseHistory() {
  const [customerId, setCustomerId] = useState('')
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('purchases')

  async function handleSearch(e) {
    e.preventDefault()
    setError('')
    setHistory(null)
    setLoading(true)
    try {
      const res = await getFullHistory(customerId)
      setHistory(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Customer not found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Purchase & Service History</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          View complete purchase and service history for a customer
        </p>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-4">Search Customer</h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            required
            type="number"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter Customer ID"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-red-500 text-sm">{error}</p>
        )}
      </div>

      {/* Results */}
      {history && (
        <>
          {/* Customer Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'CUSTOMER', value: history.customerName },
              { label: 'TOTAL SPENT', value: `Rs. ${history.totalSpent?.toFixed(2)}` },
              { label: 'TOTAL VISITS', value: history.totalVisits },
              { label: 'PURCHASES', value: history.purchaseHistory?.length },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 tracking-wide mb-1">
                  {card.label}
                </p>
                <p className="text-lg font-bold text-slate-900 truncate">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('purchases')}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'purchases'
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Purchase History ({history.purchaseHistory?.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 text-sm font-semibold transition-colors ${
                  activeTab === 'services'
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Service History ({history.serviceHistory?.length})
              </button>
            </div>

            {/* Purchase History Tab */}
            {activeTab === 'purchases' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-6 py-3">Invoice ID</th>
                    <th className="text-left px-6 py-3">Type</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Staff</th>
                    <th className="text-left px-6 py-3">Subtotal</th>
                    <th className="text-left px-6 py-3">Discount</th>
                    <th className="text-left px-6 py-3">Total</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.purchaseHistory?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-400">
                        No purchase history found.
                      </td>
                    </tr>
                  ) : (
                    history.purchaseHistory?.map((invoice) => (
                      <tr
                        key={invoice.invoiceID}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          #{invoice.invoiceID}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{invoice.type}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{invoice.staffName}</td>
                        <td className="px-6 py-4 text-slate-500">
                          Rs. {invoice.subTotal?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {invoice.loyaltyDiscountApplied ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              -Rs. {invoice.discountAmount?.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          Rs. {invoice.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-semibold ${
                              invoice.isPaid ? 'text-green-600' : 'text-amber-500'
                            }`}
                          >
                            ● {invoice.isPaid ? 'Paid' : 'Credit'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Service History Tab */}
            {activeTab === 'services' && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-6 py-3">Appointment ID</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Time Slot</th>
                    <th className="text-left px-6 py-3">Service</th>
                    <th className="text-left px-6 py-3">Vehicle</th>
                    <th className="text-left px-6 py-3">Staff</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.serviceHistory?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No service history found.
                      </td>
                    </tr>
                  ) : (
                    history.serviceHistory?.map((appt) => (
                      <tr
                        key={appt.appointmentID}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          #{appt.appointmentID}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(appt.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{appt.timeSlot}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {appt.serviceDescription}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {appt.vehicleMake} {appt.vehicleModel}
                          <span className="block text-xs text-slate-400">
                            {appt.vehicleNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{appt.staffName}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-semibold ${
                              appt.status === 'Completed'
                                ? 'text-green-600'
                                : appt.status === 'Pending'
                                ? 'text-amber-500'
                                : 'text-red-500'
                            }`}
                          >
                            ● {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
              {activeTab === 'purchases'
                ? `Showing ${history.purchaseHistory?.length} purchases`
                : `Showing ${history.serviceHistory?.length} services`}
            </div>
          </div>
        </>
      )}
    </div>
  )
}