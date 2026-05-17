import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import StaffDirectory from './pages/staff/StaffDirectory'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="staff" element={<StaffDirectory />} />
      </Route>
    </Routes>
  )
}

export default App
