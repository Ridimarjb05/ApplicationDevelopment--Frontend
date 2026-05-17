import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Staff Management',  path: '/staff'    },
  { label: 'Financial Reports', path: '/financial' },
  { label: 'Inventory',         path: '/inventory' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName') || 'Admin'

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <div className="w-56 min-h-screen bg-gray-900 flex flex-col py-6">
      <div className="px-6 pb-8">
        <h2 className="text-white text-lg font-bold">AUTOPART PRO</h2>
        <p className="text-gray-400 text-xs mt-1">Admin Portal</p>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-6 py-3 text-sm border-l-4 transition-colors ${
                isActive
                  ? 'text-white bg-gray-700 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-xs mb-3 truncate">{userName}</p>
        <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors">
          Logout
        </button>
      </div>
    </div>
  )
}
