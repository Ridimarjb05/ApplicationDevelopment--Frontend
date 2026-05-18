import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/customers/CustomerList'
import RegisterCustomer from './pages/customers/RegisterCustomer'
import CustomerDetail from './pages/customers/CustomerDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/register" element={<RegisterCustomer />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
