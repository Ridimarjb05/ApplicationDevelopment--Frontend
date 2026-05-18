import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Auth
import Login  from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Admin
import FinancialReport from './pages/financial/FinancialReport'
// import StaffDirectory  from './pages/staff/StaffDirectory'
import NotificationsPage from './pages/admin/NotificationsPage'

// Staff
// import Inventory        from './pages/inventory/Inventory'
import InvoiceList      from './pages/invoices/InvoiceList'
// import VendorList       from './pages/vendors/VendorList'
// import RegisterCustomer from './pages/customers/RegisterCustomer'
import CreateInvoice    from './pages/staff/CreateInvoice'
import CustomerViewPage    from './pages/staff/CustomerViewPage'
import CustomerReportsPage from './pages/staff/CustomerReportsPage'

// Customer
import AppointmentsPage from './pages/customer/AppointmentsPage'
import PartRequestsPage from './pages/customer/PartRequestsPage'
import ReviewsPage      from './pages/customer/ReviewsPage'
import PurchaseHistory   from './pages/customer/PurchaseHistory'
import LoyaltyProgram    from './pages/customer/LoyaltyProgram'

const ComingSoon = ({ name }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-300">{name}</p>
      <p className="text-gray-400 mt-2">This page is not built yet</p>
    </div>
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/admin/financial" replace />} />

        {/* Admin */}
        <Route path="admin/financial"     element={<FinancialReport />} />
        <Route path="admin/staff"         element={<ComingSoon name="Staff Management (F2)" />} />
        <Route path="admin/notifications" element={<NotificationsPage />} />

        {/* Staff */}
        <Route path="staff/inventory"        element={<ComingSoon name="Parts Inventory (F3)" />} />
        {/* F4 — Purchase Invoices */}
        <Route path="staff/invoices"        element={<InvoiceList />} />
        <Route path="staff/invoices/create" element={<CreateInvoice />} />
        <Route path="staff/vendors"          element={<ComingSoon name="Vendor Management (F5)" />} />
        <Route path="staff/customers"        element={<ComingSoon name="Register Customer (F6)" />} />
        <Route path="staff/sell" element={<CreateInvoice />} />
        <Route path="staff/customer-view"    element={<CustomerViewPage />} />
        <Route path="staff/customer-reports" element={<CustomerReportsPage />} />

        {/* Customer */}
        <Route path="customer/appointments"  element={<AppointmentsPage />} />
        <Route path="customer/part-requests" element={<PartRequestsPage />} />
        <Route path="customer/reviews"       element={<ReviewsPage />} />
      n <Route path="customer/history" element={<PurchaseHistory />} />
        <Route path="customer/loyalty" element={<LoyaltyProgram />} />

      </Route>
    </Routes>
  )
}