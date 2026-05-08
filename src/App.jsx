import React, { useState } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import StaffDirectory from './features/staff/StaffDirectory';
import PartsInventory from './features/parts/PartsInventory';
import FinancialDashboard from './features/financial/FinancialDashboard';

// App.jsx - root component
// we use a simple currentPage string to decide which page to show
// no router needed for this project
function App() {
  // start at login page
  const [currentPage, setCurrentPage] = useState('login');

  // navigate changes which page is showing
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // logout clears the token and sends user back to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setCurrentPage('login');
  };

  // show login page
  if (currentPage === 'login') {
    return <Login onNavigate={navigate} />;
  }

  // show register page
  if (currentPage === 'signup') {
    return <Register onNavigate={navigate} />;
  }

  // Feature 1 - show financial report dashboard
  if (currentPage === 'dashboard' || currentPage === 'financial') {
    return <FinancialDashboard onNavigate={navigate} onLogout={handleLogout} />;
  }

  // Feature 2 - show staff management page
  if (currentPage === 'staff') {
    return <StaffDirectory onNavigate={navigate} onLogout={handleLogout} />;
  }

  // Feature 3 - show parts inventory page
  if (currentPage === 'inventory') {
    return <PartsInventory onNavigate={navigate} onLogout={handleLogout} />;
  }

  // fallback to login if page not found
  return <Login onNavigate={navigate} />;
}

export default App;
