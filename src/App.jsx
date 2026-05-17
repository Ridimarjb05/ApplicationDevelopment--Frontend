import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CustomerSearch from "./pages/staff/CustomerSearch";
import SendInvoice from "./pages/staff/SendInvoice";
import Register from "./pages/auth/Register";
import Profile from "./pages/customer/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-gray-800">Welcome to VehicleParts</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/staff/customers" element={<CustomerSearch />} />
          <Route path="/staff/send-invoice" element={<SendInvoice />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}