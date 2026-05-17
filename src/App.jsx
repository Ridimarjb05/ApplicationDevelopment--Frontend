import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import StaffDirectory from './features/staff/StaffDirectory'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/staff" replace />} />
        <Route path="staff" element={<StaffDirectory />} />
      </Route>
      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  )
}

export default App
