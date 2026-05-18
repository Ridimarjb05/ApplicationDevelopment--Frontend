import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookAppointment, getAppointments } from "../../services/f13Service";
import { getCurrentCustomerId } from "../../services/auth";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const customerId = getCurrentCustomerId();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    vehicleId: "",
    staffId: "",
    appointmentDate: "",
    timeSlot: "",
    serviceDescription: "",
  });

  // Guard: if no customerId, the session is stale — force re-login
  useEffect(() => {
    if (!customerId) {
      localStorage.clear();
      navigate("/login");
    }
  }, []);

  // Load this customer's appointments.
  const loadAppointments = async () => {
    if (!customerId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getAppointments(customerId);
      setAppointments(res.data);
    } catch (err) {
      setError("Could not load appointments. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) loadAppointments();
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
      await bookAppointment({
        customerId: customerId,
        vehicleId: Number(form.vehicleId),
        staffId: Number(form.staffId),
        appointmentDate: new Date(form.appointmentDate).toISOString(),
        timeSlot: form.timeSlot,
        serviceDescription: form.serviceDescription,
      });
      setSuccessMsg("Appointment booked successfully.");
      setForm({
        vehicleId: "",
        staffId: "",
        appointmentDate: "",
        timeSlot: "",
        serviceDescription: "",
      });
      loadAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Check your input and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Appointments</h1>
      <p className="text-gray-500 text-sm mb-6">
        Book a service appointment and view your existing bookings.
      </p>

      {/* Booking form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Book a New Appointment
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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vehicle ID
            </label>
            <input
              type="number"
              name="vehicleId"
              value={form.vehicleId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Staff ID
            </label>
            <input
              type="number"
              name="staffId"
              value={form.staffId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Appointment Date
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Time Slot
            </label>
            <select
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a slot</option>
              <option value="09:00 - 10:00">09:00 - 10:00</option>
              <option value="10:00 - 11:00">10:00 - 11:00</option>
              <option value="11:00 - 12:00">11:00 - 12:00</option>
              <option value="13:00 - 14:00">13:00 - 14:00</option>
              <option value="14:00 - 15:00">14:00 - 15:00</option>
              <option value="15:00 - 16:00">15:00 - 16:00</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Service Description
            </label>
            <textarea
              name="serviceDescription"
              value={form.serviceDescription}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the service you need..."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2 rounded"
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>

      {/* Appointment list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          My Appointments
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 text-sm">No appointments booked yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Time Slot</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr
                    key={a.appointmentID}
                    className="border-b border-gray-100"
                  >
                    <td className="py-2 pr-4">{a.appointmentID}</td>
                    <td className="py-2 pr-4">
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-2 pr-4">{a.timeSlot}</td>
                    <td className="py-2 pr-4">{a.serviceDescription}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                        {a.status}
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
