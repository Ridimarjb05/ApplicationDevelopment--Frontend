import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/Login'
import Signup from './features/auth/Signup'

function App() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
