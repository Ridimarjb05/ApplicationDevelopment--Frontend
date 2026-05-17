import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Inventory from './features/inventory/Inventory'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/inventory" replace />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
      <Route path="*" element={<Navigate to="/inventory" replace />} />
    </Routes>
  )
}

export default App
