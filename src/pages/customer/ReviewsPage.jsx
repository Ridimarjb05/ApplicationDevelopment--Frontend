import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitReview, getReviews } from "../../services/f13Service";
import { getCurrentCustomerId } from "../../services/auth";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const customerId = getCurrentCustomerId();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    appointmentId: "",
    rating: "5",
    comment: "",
  });

  // Guard: if no customerId, session is stale — force re-login
  useEffect(() => {
    if (!customerId) {
      localStorage.clear();
      navigate("/login");
    }
  }, []);

  const loadReviews = async () => {
    if (!customerId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getReviews(customerId);
      setReviews(res.data);
    } catch (err) {
      setError("Could not load reviews. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) loadReviews();
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
      await submitReview({
        customerId: customerId,
        appointmentId: Number(form.appointmentId),
        rating: Number(form.rating),
        comment: form.comment,
      });
      setSuccessMsg("Review submitted successfully.");
      setForm({ appointmentId: "", rating: "5", comment: "" });
      loadReviews();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Check your input and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Render star characters for a given rating (1-5).
  const renderStars = (rating) => {
    const full = "★".repeat(Math.max(0, Math.min(5, rating)));
    const empty = "☆".repeat(5 - Math.max(0, Math.min(5, rating)));
    return full + empty;
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Service Reviews</h1>
      <p className="text-gray-500 text-sm mb-6">
        Leave a review for a completed service appointment.
      </p>

      {/* Review form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Submit a Review
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
              Appointment ID
            </label>
            <input
              type="number"
              name="appointmentId"
              value={form.appointmentId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Very Poor</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Comment
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience..."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2 rounded"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* Review list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">My Reviews</h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.serviceReviewID}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-amber-500 text-lg">
                    {renderStars(rev.rating)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Appointment #{rev.appointmentID}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}