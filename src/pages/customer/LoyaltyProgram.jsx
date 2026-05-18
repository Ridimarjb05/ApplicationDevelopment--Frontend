import { useState, useEffect } from 'react'
import { getLoyaltySummary, checkDiscountEligibility } from '../../services/loyaltyAPI'
import { getRole, getCurrentCustomerId } from '../../services/auth'

export default function LoyaltyProgram() {
  const role       = getRole()        // 'Admin' | 'Staff' | 'Customer'
  const myId       = getCurrentCustomerId()
  const isCustomer = role === 'Customer'

  // For Admin/Staff: search field
  const [searchId,  setSearchId]  = useState('')
  // The ID we actually query (auto-set for customers, entered for admin/staff)
  const [queryId,   setQueryId]   = useState(isCustomer ? myId : '')

  const [summary,   setSummary]   = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // Discount checker
  const [subTotal,        setSubTotal]        = useState('')
  const [discountResult,  setDiscountResult]  = useState(null)
  const [checkingDiscount, setCheckingDiscount] = useState(false)

  // Auto-load for customers on mount
  useEffect(() => {
    if (isCustomer && myId) fetchSummary(myId)
  }, [])

  async function fetchSummary(id) {
    setError(''); setSummary(null); setDiscountResult(null); setLoading(true)
    try {
      const res = await getLoyaltySummary(id)
      setSummary(res.data)
      setQueryId(id)
    } catch (err) {
      setError(err.response?.data?.message || 'Customer not found.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    if (searchId) fetchSummary(searchId)
  }

  async function handleCheckDiscount(e) {
    e.preventDefault()
    setCheckingDiscount(true); setDiscountResult(null)
    try {
      const res = await checkDiscountEligibility(queryId, subTotal)
      setDiscountResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check discount.')
    } finally {
      setCheckingDiscount(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Loyalty Program</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {isCustomer
            ? 'Your loyalty points and discount eligibility'
            : 'Look up a customer\'s loyalty points and discount eligibility'}
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How the Loyalty Program Works</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Customers automatically receive a <strong>10% discount</strong> on any single
              purchase where the subtotal exceeds <strong>Rs. 5,000</strong>. The discount is
              applied automatically when creating a sale invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Admin/Staff: Search box */}
      {!isCustomer && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Search Customer</h3>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              required
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
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
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </div>
      )}

      {/* Customer: loading/error state */}
      {isCustomer && loading && (
        <p className="text-slate-500 text-sm mb-4">Loading your loyalty data…</p>
      )}
      {isCustomer && error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'CUSTOMER',       value: summary.customerName },
              { label: 'TOTAL SPENT',    value: `Rs. ${summary.totalSpent?.toFixed(2)}` },
              { label: 'LOYALTY POINTS', value: summary.loyaltyPoints },
              { label: 'CREDIT STATUS',  value: summary.creditStatus },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 tracking-wide mb-1">{card.label}</p>
                <p className="text-lg font-bold text-slate-900 truncate">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Discount Checker */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Check Discount Eligibility</h3>
            <form onSubmit={handleCheckDiscount} className="flex gap-3">
              <input
                required
                type="number"
                value={subTotal}
                onChange={(e) => setSubTotal(e.target.value)}
                placeholder="Enter subtotal amount"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <button
                type="submit"
                disabled={checkingDiscount}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {checkingDiscount ? 'Checking…' : 'Check Discount'}
              </button>
            </form>

            {discountResult && (
              <div className={`mt-4 p-4 rounded-xl border ${
                discountResult.isEligibleForDiscount
                  ? 'bg-green-50 border-green-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <p className={`font-semibold text-sm mb-2 ${
                  discountResult.isEligibleForDiscount ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {discountResult.isEligibleForDiscount ? '✅' : '⚠️'}{' '}
                  {discountResult.message}
                </p>
                {discountResult.isEligibleForDiscount && (
                  <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                      <p className="font-bold text-slate-900">Rs. {discountResult.subTotal?.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-slate-500 mb-1">Discount (10%)</p>
                      <p className="font-bold text-green-600">-Rs. {discountResult.discountAmount?.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-slate-500 mb-1">Final Amount</p>
                      <p className="font-bold text-slate-900">Rs. {discountResult.finalAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loyalty Transactions */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Loyalty Transaction History</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3">ID</th>
                  <th className="text-left px-6 py-3">Invoice ID</th>
                  <th className="text-left px-6 py-3">Reason</th>
                  <th className="text-left px-6 py-3">Points Earned</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {summary.transactions?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">
                      No loyalty transactions yet.
                    </td>
                  </tr>
                ) : (
                  summary.transactions?.map((t) => (
                    <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">#{t.id}</td>
                      <td className="px-6 py-4 text-slate-500">#{t.invoiceID}</td>
                      <td className="px-6 py-4 text-slate-500">{t.reason}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {t.pointsEarned} pts
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing {summary.transactions?.length} transactions
            </div>
          </div>
        </>
      )}
    </div>
  )
}