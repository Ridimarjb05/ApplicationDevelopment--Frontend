import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Inventory from './pages/inventory/Inventory'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  )
}

export default App
