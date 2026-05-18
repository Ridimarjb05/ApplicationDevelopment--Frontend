import { useState, useEffect } from "react";
import {
  getLowStockParts,
  notifyAdminLowStock,
  getOverdueCredits,
  sendCreditReminders,
} from "../../services/notificationService";

// Admin user ID that low-stock alerts are sent to.
// Hardcoded for now; replace with the logged-in admin's ID once
// login is integrated.
const ADMIN_USER_ID = 1;

export default function NotificationsPage() {
  const [lowStock, setLowStock] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notifyingStock, setNotifyingStock] = useState(false);
  const [notifyingCredit, setNotifyingCredit] = useState(false);
  const [stockMsg, setStockMsg] = useState("");
  const [creditMsg, setCreditMsg] = useState("");

  const money = (n) => `Rs. ${Number(n ?? 0).toLocaleString()}`;
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "Never");

  // Load both lists.
  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [stockRes, creditRes] = await Promise.all([
        getLowStockParts(),
        getOverdueCredits(),
      ]);
      setLowStock(stockRes.data);
      setOverdue(creditRes.data);
    } catch (err) {
      setError("Could not load notifications. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleNotifyStock = async () => {
    setStockMsg("");
    setNotifyingStock(true);
    try {
      await notifyAdminLowStock(ADMIN_USER_ID);
      setStockMsg("Low stock notifications sent to admin.");
    } catch (err) {
      setStockMsg("Failed to send low stock notifications.");
    } finally {
      setNotifyingStock(false);
    }
  };

  const handleSendReminders = async () => {
    setCreditMsg("");
    setNotifyingCredit(true);
    try {
      await sendCreditReminders();
      setCreditMsg("Credit reminders sent to overdue customers.");
    } catch (err) {
      setCreditMsg("Failed to send credit reminders.");
    } finally {
      setNotifyingCredit(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Notifications</h1>
      <p className="text-gray-500 text-sm mb-6">
        System alerts for low stock parts and overdue customer credit.
      </p>

      {error && (
        <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
          {error}
        </div>
      )}

      {/* Low stock section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Low Stock Parts ({lowStock.length})
          </h2>
          <button
            onClick={handleNotifyStock}
            disabled={notifyingStock || lowStock.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded"
          >
            {notifyingStock ? "Sending..." : "Notify Admin"}
          </button>
        </div>

        {stockMsg && (
          <div className="mb-4 rounded bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2">
            {stockMsg}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : lowStock.length === 0 ? (
          <p className="text-gray-500 text-sm">
            All parts are above their stock thresholds.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">Part No.</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Threshold</th>
                  <th className="py-2 pr-4">Vendor</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.partID} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{p.partNumber}</td>
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4">{p.category}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{p.lowStockThreshold}</td>
                    <td className="py-2 pr-4">{p.vendorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overdue credits section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Overdue Credit Customers ({overdue.length})
          </h2>
          <button
            onClick={handleSendReminders}
            disabled={notifyingCredit || overdue.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded"
          >
            {notifyingCredit ? "Sending..." : "Send Reminders"}
          </button>
        </div>

        {creditMsg && (
          <div className="mb-4 rounded bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2">
            {creditMsg}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : overdue.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No customers with overdue credit.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Credit Balance</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Last Reminder</th>
                </tr>
              </thead>
              <tbody>
                {overdue.map((c) => (
                  <tr key={c.customerID} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{c.customerID}</td>
                    <td className="py-2 pr-4 font-medium">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="py-2 pr-4">{c.phone}</td>
                    <td className="py-2 pr-4">{money(c.creditBalance)}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">
                        {c.creditStatus}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      {fmtDate(c.lastCreditReminderSent)}
                    </td>
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