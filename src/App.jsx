import React, { useState } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import StaffDirectory from './features/staff/StaffDirectory';
import PartsInventory from './features/parts/PartsInventory';

// App is the root component - it decides which page to show
// we use a simple string state to handle navigation (no router needed for now)
function App() {
  // currentPage tells the app which component to render
  const [currentPage, setCurrentPage] = useState('login');

  // navigate function is passed down to child components
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // logout clears token and goes back to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setCurrentPage('login');
  };

  // show the login page
  if (currentPage === 'login') {
    return <Login onNavigate={navigate} />;
  }

  // show the signup/register page
  if (currentPage === 'signup') {
    return <Register onNavigate={navigate} />;
  }

  // show the staff management page (Feature 2)
  if (currentPage === 'staff') {
    return <StaffDirectory onNavigate={navigate} onLogout={handleLogout} />;
  }

  // show the parts inventory page (Feature 3)
  if (currentPage === 'inventory') {
    return <PartsInventory onNavigate={navigate} onLogout={handleLogout} />;
  }

  // fallback - go to login if page not found
  return <Login onNavigate={navigate} />;
}

export default App;
