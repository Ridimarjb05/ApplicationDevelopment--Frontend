import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import InvoiceList from './pages/invoices/InvoiceList'
import CreateInvoice from './pages/invoices/CreateInvoice'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
