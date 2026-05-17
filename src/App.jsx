import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CustomerViewPage from "./pages/staff/CustomerViewPage";

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
          {/* Feature 8 — Customer view (Staff) */}
          <Route path="staff/customer-view" element={<CustomerViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}