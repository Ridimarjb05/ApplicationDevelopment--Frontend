import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import NotificationsPage from "./pages/admin/NotificationsPage";

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
          {/* Feature 15 — Notifications (Admin) */}
          <Route path="admin/notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}