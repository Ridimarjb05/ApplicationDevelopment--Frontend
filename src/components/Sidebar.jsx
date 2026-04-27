import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Mail, 
  UserCircle, 
  LayoutDashboard,
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Clear any session data here if needed
      // localStorage.removeItem('token'); 
      navigate('/');
      alert('You have been logged out.');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customer Registration', path: '/register', icon: UserPlus },
    { name: 'Staff Search', path: '/staff-search', icon: Search },
    { name: 'Email Invoicing', path: '/send-invoice', icon: Mail },
    { name: 'Customer Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">V</div>
        <div className="brand-name">PartsCenter</div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
