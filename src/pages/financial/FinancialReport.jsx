import { useState, useEffect } from 'react'
import { getFinancialSummary, getMonthlyReport, getTopParts } from '../../services/financialAPI'

export default function FinancialReport() {
  const [summary, setSummary]   = useState(null)
  const [monthly, setMonthly]   = useState([])
  const [topParts, setTopParts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
       const [s, m, t] = await Promise.all([getFinancialSummary(), getMonthlyReport(new Date().getFullYear()), getTopParts()])
      setSummary(s.data); setMonthly(m.data); setTopParts(t.data)
      } catch { setError('Failed to load financial data. Make sure the backend is running.') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading financial report...</div>
  if (error)   return <div className="p-8 text-red-500 text-sm">{error}</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">Revenue overview and top-selling parts</p>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Revenue',     value: `$${summary.totalRevenue?.toLocaleString() ?? 0}` },
            { label: 'Total Invoices',    value: summary.totalInvoices ?? 0 },
            { label: 'Avg Invoice Value', value: `$${summary.avgInvoiceValue?.toFixed(2) ?? '0.00'}` },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-6">
              <p className="text-xs font-semibold text-slate-400 tracking-wide mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Monthly Revenue</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <th className="text-left px-6 py-3">Month</th>
                <th className="text-left px-6 py-3">Revenue</th>
                <th className="text-left px-6 py-3">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {monthly.length === 0
                ? <tr><td colSpan={3} className="text-center py-6 text-slate-400">No data available</td></tr>
                : monthly.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-6 py-3 font-medium text-slate-800">{row.month}</td>
                    <td className="px-6 py-3 text-green-600 font-semibold">${row.revenue?.toLocaleString()}</td>
                    <td className="px-6 py-3 text-slate-500">{row.invoiceCount}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Top Selling Parts</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <th className="text-left px-6 py-3">Part</th>
                <th className="text-left px-6 py-3">Qty</th>
                <th className="text-left px-6 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topParts.length === 0
                ? <tr><td colSpan={3} className="text-center py-6 text-slate-400">No data available</td></tr>
                : topParts.map((p, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-6 py-3 font-medium text-slate-800">{p.partName}</td>
                    <td className="px-6 py-3 text-slate-600">{p.totalQuantity}</td>
                    <td className="px-6 py-3 text-green-600 font-semibold">${p.totalRevenue?.toLocaleString()}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
