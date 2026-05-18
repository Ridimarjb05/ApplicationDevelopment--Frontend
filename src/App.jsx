import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CustomerSearch from "./pages/staff/CustomerSearch";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-gray-800">Welcome to VehicleParts</h1>} />
          <Route path="/staff/customers" element={<CustomerSearch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}