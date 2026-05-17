import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import FinancialReport from './pages/financial/FinancialReport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="financial" element={<FinancialReport />} />
      </Route>
    </Routes>
  )
}

export default App
