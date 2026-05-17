import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import FinancialReport from './features/financial/FinancialReport'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/financial" replace />} />
        <Route path="financial" element={<FinancialReport />} />
      </Route>
      <Route path="*" element={<Navigate to="/financial" replace />} />
    </Routes>
  )
}

export default App
