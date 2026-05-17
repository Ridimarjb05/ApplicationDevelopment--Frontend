import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/staff', label: 'Staff Management' },
  { to: '/financial', label: 'Financial Reports' },
  { to: '/inventory', label: 'Inventory' },
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
    <aside className="w-64 min-w-64 bg-slate-900 flex flex-col h-full">
      <div className="px-6 py-6 border-b border-slate-700">
        <p className="text-white font-bold text-lg">Precision Auto</p>
        <p className="text-slate-400 text-xs mt-0.5">Admin Suite</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white border-l-4 border-blue-500 rounded-none rounded-r-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-700 space-y-1">
        <div className="px-4 py-2.5 text-slate-400 text-sm truncate">{userName}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
