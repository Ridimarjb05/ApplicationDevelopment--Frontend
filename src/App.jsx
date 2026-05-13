import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'
import StaffDirectory from './features/staff/StaffDirectory'
import FinancialReport from './features/financial/FinancialReport'
import Inventory from './features/inventory/Inventory'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/staff" replace />} />
        <Route path="staff"     element={<StaffDirectory />} />
        <Route path="financial" element={<FinancialReport />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
