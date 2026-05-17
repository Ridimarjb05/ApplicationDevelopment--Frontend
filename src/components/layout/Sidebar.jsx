import { Link, useLocation } from "react-router-dom";

const customerNavItems = [
  { label: "Dashboard", path: "/" },
  { label: "Register", path: "/register" },
  { label: "Appointments", path: "/customer/appointments" },
  { label: "Part Requests", path: "/customer/part-requests" },
  { label: "Reviews", path: "/customer/reviews" },
  { label: "My Profile", path: "/customer/profile" },
];

const staffNavItems = [
  { label: "Search Customers", path: "/staff/customers" },
  { label: "Send Invoice", path: "/staff/send-invoice" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen bg-gray-900 flex flex-col py-6 shadow-xl z-10 relative">
      <div className="px-6 pb-8">
        <h2 className="text-white text-xl font-bold tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          AUTOPART PRO
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-2">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Customer Portal</p>
        </div>
        <nav className="mb-8">
          {customerNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-6 py-3 text-sm transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-white bg-gray-800 border-l-4 border-blue-500 font-medium shadow-md"
                  : "text-gray-400 border-l-4 border-transparent hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-2">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Staff Portal</p>
        </div>
        <nav>
          {staffNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-6 py-3 text-sm transition-all duration-200 ${
                location.pathname.startsWith(item.path)
                  ? "text-white bg-gray-800 border-l-4 border-emerald-500 font-medium shadow-md"
                  : "text-gray-400 border-l-4 border-transparent hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
