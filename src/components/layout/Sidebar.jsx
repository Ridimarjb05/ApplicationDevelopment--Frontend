import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Appointments", path: "/customer/appointments" },
  { label: "Part Requests", path: "/customer/part-requests" },
  { label: "Reviews", path: "/customer/reviews" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-56 min-h-screen bg-gray-900 flex flex-col py-6">
      <div className="px-6 pb-8">
        <h2 className="text-white text-lg font-bold">AUTOPART PRO</h2>
        <p className="text-gray-400 text-xs mt-1">Customer Portal</p>
      </div>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-6 py-3 text-sm ${
              location.pathname === item.path
                ? "text-white bg-gray-700 border-l-4 border-blue-500"
                : "text-gray-400 border-l-4 border-transparent"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}