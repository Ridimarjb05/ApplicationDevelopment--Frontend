import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AppointmentsPage from "./pages/customer/AppointmentsPage";
import PartRequestsPage from "./pages/customer/PartRequestsPage";
import ReviewsPage from "./pages/customer/ReviewsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome to AutoPart Pro
              </h1>
            }
          />
          <Route path="customer/appointments" element={<AppointmentsPage />} />
          <Route path="customer/part-requests" element={<PartRequestsPage />} />
          <Route path="customer/reviews" element={<ReviewsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}