import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Auth
import Login  from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Admin
import FinancialReport from './pages/financial/FinancialReport'
import NotificationsPage from './pages/admin/NotificationsPage'
import StaffDirectory from './pages/staff/StaffDirectory'

// Staff
import CreateInvoice    from './pages/staff/CreateInvoice'          // F7 — sell parts
import CustomerViewPage    from './pages/staff/CustomerViewPage'
import CustomerReportsPage from './pages/staff/CustomerReportsPage'
import Inventory           from './pages/inventory/Inventory'

// F4 — Purchase Invoices
import InvoiceList          from './pages/invoices/InvoiceList'
import PurchaseInvoiceCreate from './pages/invoices/CreateInvoice'   // aliased — avoids F7 clash

// F5 — Vendors
import VendorList from './pages/vendors/VendorList'
import VendorForm from './pages/vendors/VendorForm'

// F6 — Customers
import RegisterCustomer from './pages/customers/RegisterCustomer'
import CustomerList     from './pages/customers/CustomerList'
import CustomerDetail   from './pages/customers/CustomerDetail'

// Customer portal
import AppointmentsPage from './pages/customer/AppointmentsPage'
import PartRequestsPage from './pages/customer/PartRequestsPage'
import ReviewsPage      from './pages/customer/ReviewsPage'
import PurchaseHistory  from './pages/customer/PurchaseHistory'
import LoyaltyProgram   from './pages/customer/LoyaltyProgram'

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
        <Route path="admin/staff"         element={<StaffDirectory />} />
        <Route path="admin/notifications" element={<NotificationsPage />} />

        {/* Staff */}
        <Route path="staff/inventory"        element={<Inventory />} />

        {/* F4 — Purchase Invoices */}
        <Route path="staff/invoices"         element={<InvoiceList />} />
        <Route path="staff/invoices/create"  element={<PurchaseInvoiceCreate />} />

        {/* F5 — Vendor Management */}
        <Route path="staff/vendors"          element={<VendorList />} />
        <Route path="staff/vendors/new"      element={<VendorForm />} />
        <Route path="staff/vendors/:id/edit" element={<VendorForm />} />

        {/* F6 — Customer Registration */}
        <Route path="staff/customers"          element={<CustomerList />} />
        <Route path="staff/customers/register" element={<RegisterCustomer />} />
        <Route path="staff/customers/:id"      element={<CustomerDetail />} />

        {/* F7 — Sell Parts */}
        <Route path="staff/sell"             element={<CreateInvoice />} />
        <Route path="staff/customer-view"    element={<CustomerViewPage />} />
        <Route path="staff/customer-reports" element={<CustomerReportsPage />} />

        {/* Customer */}
        <Route path="customer/appointments"  element={<AppointmentsPage />} />
        <Route path="customer/part-requests" element={<PartRequestsPage />} />
        <Route path="customer/reviews"       element={<ReviewsPage />} />
        <Route path="customer/history"       element={<PurchaseHistory />} />
        <Route path="customer/loyalty"       element={<LoyaltyProgram />} />
      </Route>
    </Routes>
  )
}