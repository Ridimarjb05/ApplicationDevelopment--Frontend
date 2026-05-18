import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: '#131929' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto', background: '#f4f6f9', padding: '24px 28px 40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
