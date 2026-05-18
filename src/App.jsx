import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CustomerReportsPage from "./pages/staff/CustomerReportsPage";

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
          {/* Feature 9 — Customer Reports (Staff) */}
          <Route path="staff/customer-reports" element={<CustomerReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}