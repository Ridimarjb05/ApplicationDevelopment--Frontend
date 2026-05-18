import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Placeholder from './pages/shared/Placeholder'

// Auth
import Login from './pages/auth/Login' 
import Signup from './pages/auth/Signup'


// Admin
// import FinancialReport from './pages/financial/FinancialReport'
// import StaffDirectory  from './pages/staff/StaffDirectory'
import NotificationsPage from './pages/admin/NotificationsPage'

// Staff
// import Inventory        from './pages/inventory/Inventory'
// import InvoiceList      from './pages/invoices/InvoiceList'
// import VendorList       from './pages/vendors/VendorList'
// import RegisterCustomer from './pages/customers/RegisterCustomer'
// import CreateInvoice    from './pages/staff/CreateInvoice'
import CustomerViewPage    from './pages/staff/CustomerViewPage'
import CustomerReportsPage from './pages/staff/CustomerReportsPage'

// Customer
import AppointmentsPage from './pages/customer/AppointmentsPage'
import PartRequestsPage from './pages/customer/PartRequestsPage'
import ReviewsPage      from './pages/customer/ReviewsPage'
// import PurchaseHistory   from './pages/customer/PurchaseHistory'
// import LoyaltyProgram    from './pages/customer/LoyaltyProgram'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Protected shell */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/admin/financial" replace />} />

        {/* Admin */}
        <Route path="admin/financial"     element={<Placeholder name="Financial Report (F1)" />} />
        <Route path="admin/staff"         element={<Placeholder name="Staff Management (F2)" />} />
        <Route path="admin/notifications" element={<NotificationsPage />} />

        {/* Staff */}
        <Route path="staff/inventory"        element={<Placeholder name="Parts Inventory (F3)" />} />
        <Route path="staff/invoices"         element={<Placeholder name="Purchase Invoices (F4)" />} />
        <Route path="staff/vendors"          element={<Placeholder name="Vendor Management (F5)" />} />
        <Route path="staff/customers"        element={<Placeholder name="Register Customer (F6)" />} />
        <Route path="staff/sell"             element={<Placeholder name="Sell Parts / Invoice (F7)" />} />
        <Route path="staff/customer-view"    element={<CustomerViewPage />} />
        <Route path="staff/customer-reports" element={<CustomerReportsPage />} />

        {/* Customer */}
        <Route path="customer/appointments"  element={<AppointmentsPage />} />
        <Route path="customer/part-requests" element={<PartRequestsPage />} />
        <Route path="customer/reviews"       element={<ReviewsPage />} />
        <Route path="customer/history"       element={<Placeholder name="Purchase History (F14)" />} />
        <Route path="customer/loyalty"       element={<Placeholder name="Loyalty Program (F16)" />} />
      </Route>
    </Routes>
  )
}