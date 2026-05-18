import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestPart, getPartRequests } from "../../services/f13Service";
import { getCurrentCustomerId } from "../../services/auth";

export default function PartRequestsPage() {
  const navigate = useNavigate();
  const customerId = getCurrentCustomerId();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    partName: "",
    quantity: "",
    notes: "",
  });

  // Guard: if no customerId, session is stale — force re-login
  useEffect(() => {
    if (!customerId) {
      localStorage.clear();
      navigate("/login");
    }
  }, []);

  const loadRequests = async () => {
    if (!customerId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getPartRequests(customerId);
      setRequests(res.data);
    } catch (err) {
      setError("Could not load part requests. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      await requestPart({
        customerId: customerId,
        partName: form.partName,
        quantity: Number(form.quantity),
        notes: form.notes,
      });
      setSuccessMsg("Part request submitted successfully.");
      setForm({ partName: "", quantity: "", notes: "" });
      loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit part request. Check your input and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Part Requests</h1>
      <p className="text-gray-500 text-sm mb-6">
        Request a part that is out of stock or not currently carried.
      </p>

      {/* Request form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Request a Part
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Part Name
            </label>
            <input
              type="text"
              name="partName"
              value={form.partName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Brake Pad Set"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any extra details (brand, model compatibility, etc.)"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2 rounded"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>

      {/* Request list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          My Part Requests
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading part requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-sm">No part requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Part Name</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4">Notes</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.partRequestID} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{r.partRequestID}</td>
                    <td className="py-2 pr-4">{r.partName}</td>
                    <td className="py-2 pr-4">{r.quantity}</td>
                    <td className="py-2 pr-4">{r.notes || "-"}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                        {r.status}
                      </span>
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