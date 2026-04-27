import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import RegisterCustomer from "../pages/RegisterCustomer";
import CustomerProfile from "../pages/CustomerProfile";
import StaffSearch from "../pages/StaffSearch";
import SendInvoice from "../pages/SendInvoice";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterCustomer />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/staff-search" element={<StaffSearch />} />
            <Route path="/send-invoice" element={<SendInvoice />} />
        </Routes>
    );
}