import { NavLink, useNavigate } from 'react-router-dom'
import { getUserName, logout } from '../../services/auth'

const adminLinks = [
  { label: 'Financial Report',  path: '/admin/financial'     },  // F1
  { label: 'Staff Management',  path: '/admin/staff'         },  // F2
  { label: 'Notifications',     path: '/admin/notifications' },  // F15
]

const staffLinks = [
  { label: 'Parts Inventory',   path: '/staff/inventory'     },  // F3
  { label: 'Purchase Invoices', path: '/staff/invoices'      },  // F4
  { label: 'Vendor Management', path: '/staff/vendors'       },  // F5
  { label: 'Register Customer', path: '/staff/customers'     },  // F6
  { label: 'Sell Parts',        path: '/staff/sell'          },  // F7
  { label: 'Customer View',     path: '/staff/customer-view' },  // F8
  { label: 'Customer Reports',  path: '/staff/customer-reports' }, // F9
]

const customerLinks = [
  { label: 'Appointments',      path: '/customer/appointments'  }, // F13
  { label: 'Part Requests',     path: '/customer/part-requests' }, // F13
  { label: 'Reviews',           path: '/customer/reviews'       }, // F13
  { label: 'Purchase History',  path: '/customer/history'       }, // F14
  { label: 'Loyalty Program',   path: '/customer/loyalty'       }, // F16
]

function NavGroup({ title, links }) {
  return (
    <div className="mb-4">
      <p className="px-6 py-2 text-xs text-gray-500 uppercase tracking-wider">{title}</p>
      {links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block px-6 py-2.5 text-sm border-l-4 transition-colors ${
              isActive
                ? 'text-white bg-gray-700 border-blue-500'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export default function Sidebar() {
  const userName = getUserName() || 'User'

  return (
    <div className="w-56 min-h-screen bg-gray-900 flex flex-col py-6">
      <div className="px-6 pb-6">
        <h2 className="text-white text-lg font-bold">AUTOPART PRO</h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <NavGroup title="Admin"    links={adminLinks}    />
        <NavGroup title="Staff"    links={staffLinks}    />
        <NavGroup title="Customer" links={customerLinks} />
      </nav>

      <div className="px-6 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-xs mb-3 truncate">{userName}</p>
        <button
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}