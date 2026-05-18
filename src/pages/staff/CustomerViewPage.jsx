import { useState } from "react";
import {
  getCustomerDetails,
  getCustomerVehicles,
  getCustomerPurchaseHistory,
} from "../../services/customerViewService";

export default function CustomerViewPage() {
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);

  // Format a number as currency.
  const money = (n) => `Rs. ${Number(n ?? 0).toLocaleString()}`;

  // Format a date string for display.
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    const id = Number(searchId);
    if (!id || id < 1) {
      setError("Please enter a valid customer ID.");
      return;
    }

    setLoading(true);
    setCustomer(null);
    setVehicles([]);
    setHistory([]);

    try {
      // Fetch profile first — if the customer doesn't exist, this 404s.
      const detailRes = await getCustomerDetails(id);
      setCustomer(detailRes.data);

      // Then fetch vehicles and history in parallel.
      const [vehRes, histRes] = await Promise.all([
        getCustomerVehicles(id),
        getCustomerPurchaseHistory(id),
      ]);
      setVehicles(vehRes.data);
      setHistory(histRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`No customer found with ID ${id}.`);
      } else {
        setError("Could not load customer details. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Customer View</h1>
      <p className="text-gray-500 text-sm mb-6">
        Look up a customer to see their profile, vehicles, and purchase history.
      </p>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="flex items-end gap-3">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer ID
            </label>
            <input
              type="number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter customer ID"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2 rounded"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Profile section */}
      {customer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Field label="Customer ID" value={customer.customerID} />
            <Field
              label="Name"
              value={`${customer.firstName} ${customer.lastName}`}
            />
            <Field label="Phone" value={customer.phone} />
            <Field label="Address" value={customer.address} />
            <Field
              label="Date of Birth"
              value={fmtDate(customer.dateOfBirth)}
            />
            <Field
              label="Registered"
              value={fmtDate(customer.registeredAt)}
            />
            <Field label="Total Spent" value={money(customer.totalSpent)} />
            <Field label="Total Visits" value={customer.totalVisits} />
            <Field label="Loyalty Points" value={customer.loyaltyPoints} />
            <Field
              label="Credit Balance"
              value={money(customer.creditBalance)}
            />
            <Field label="Credit Status" value={customer.creditStatus} />
          </div>
        </div>
      )}

      {/* Vehicles section */}
      {customer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Vehicles ({vehicles.length})
          </h2>
          {vehicles.length === 0 ? (
            <p className="text-gray-500 text-sm">
              This customer has no vehicles registered.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 pr-4">Plate No.</th>
                    <th className="py-2 pr-4">Make</th>
                    <th className="py-2 pr-4">Model</th>
                    <th className="py-2 pr-4">Year</th>
                    <th className="py-2 pr-4">Color</th>
                    <th className="py-2 pr-4">VIN</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.vehicleID} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">
                        {v.vehicleNumber}
                      </td>
                      <td className="py-2 pr-4">{v.make}</td>
                      <td className="py-2 pr-4">{v.model}</td>
                      <td className="py-2 pr-4">{v.year}</td>
                      <td className="py-2 pr-4">{v.color}</td>
                      <td className="py-2 pr-4">{v.vin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Purchase history section */}
      {customer && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Purchase History ({history.length})
          </h2>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">
              This customer has no purchase history.
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((inv) => (
                <div
                  key={inv.invoiceID}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                    <span className="font-semibold text-gray-800">
                      Invoice #{inv.invoiceID}
                    </span>
                    <span className="text-xs text-gray-400">
                      {fmtDate(inv.createdAt)}
                    </span>
                  </div>

                  {/* Items table */}
                  {inv.items && inv.items.length > 0 && (
                    <table className="w-full text-sm mb-3">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-200">
                          <th className="py-1 pr-4">Part</th>
                          <th className="py-1 pr-4">Qty</th>
                          <th className="py-1 pr-4">Unit Price</th>
                          <th className="py-1 pr-4">Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-1 pr-4">{item.partName}</td>
                            <td className="py-1 pr-4">{item.quantity}</td>
                            <td className="py-1 pr-4">
                              {money(item.unitPrice)}
                            </td>
                            <td className="py-1 pr-4">
                              {money(item.lineTotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Invoice totals */}
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                    <span>Subtotal: {money(inv.subTotal)}</span>
                    <span>Discount: {money(inv.discountAmount)}</span>
                    <span className="font-semibold text-gray-800">
                      Total: {money(inv.totalAmount)}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        inv.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {inv.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    {inv.isCreditSale && (
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                        Credit Sale
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Small helper for a labelled read-only field.
function Field({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium">{value ?? "-"}</p>
    </div>
  );
}