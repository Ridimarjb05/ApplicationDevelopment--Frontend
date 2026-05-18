import { useState, useEffect } from "react";
import {
  getRegularCustomers,
  getHighSpenders,
  getPendingCredits,
} from "../../services/customerReportService";

const TABS = [
  { key: "regulars", label: "Regular Customers" },
  { key: "spenders", label: "High Spenders" },
  { key: "credits", label: "Pending Credits" },
];

export default function CustomerReportsPage() {
  const [activeTab, setActiveTab] = useState("regulars");
  const [topCount, setTopCount] = useState(10);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const money = (n) => `Rs. ${Number(n ?? 0).toLocaleString()}`;
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  // Load the report for the active tab.
  const loadReport = async () => {
    setLoading(true);
    setError("");
    setRows([]);
    try {
      let res;
      if (activeTab === "regulars") {
        res = await getRegularCustomers(topCount);
      } else if (activeTab === "spenders") {
        res = await getHighSpenders(topCount);
      } else {
        res = await getPendingCredits();
      }
      setRows(res.data);
    } catch (err) {
      setError("Could not load report. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Reload whenever the tab or topCount changes.
  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, topCount]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Customer Reports
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Business reports on regular customers, top spenders, and pending
        credit balances.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top-N selector (not shown for pending credits — it's a full list) */}
      {activeTab !== "credits" && (
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm text-gray-600">Show top</label>
          <select
            value={topCount}
            onChange={(e) => setTopCount(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">customers</span>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {/* Report table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading report...</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No customers found for this report.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  {activeTab === "regulars" && (
                    <th className="py-2 pr-4">Total Visits</th>
                  )}
                  {activeTab === "spenders" && (
                    <th className="py-2 pr-4">Total Spent</th>
                  )}
                  {activeTab === "credits" && (
                    <>
                      <th className="py-2 pr-4">Credit Balance</th>
                      <th className="py-2 pr-4">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((c, idx) => (
                  <tr
                    key={c.customerID}
                    className="border-b border-gray-100"
                  >
                    <td className="py-2 pr-4">{c.customerID}</td>
                    <td className="py-2 pr-4 font-medium">
                      {idx < 3 && activeTab !== "credits" && (
                        <span className="text-amber-500 mr-1">#{idx + 1}</span>
                      )}
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="py-2 pr-4">{c.phone}</td>
                    {activeTab === "regulars" && (
                      <td className="py-2 pr-4">{c.totalVisits}</td>
                    )}
                    {activeTab === "spenders" && (
                      <td className="py-2 pr-4">{money(c.totalSpent)}</td>
                    )}
                    {activeTab === "credits" && (
                      <>
                        <td className="py-2 pr-4">
                          {money(c.creditBalance)}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">
                            {c.creditStatus}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}