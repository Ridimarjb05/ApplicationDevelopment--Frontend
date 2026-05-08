import React, { useState } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import FinancialDashboard from './features/financial/FinancialDashboard';

// App.jsx - root component for Feature 1: Financial Report
// we use a simple page state string to switch between pages
// StaffDirectory and PartsInventory are in feature/f2 and feature/f3 branches
function App() {
  // start at login page
  const [currentPage, setCurrentPage] = useState('login');

  // navigate to a different page
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // logout clears the stored token and goes back to login
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

  // Feature 1 - financial dashboard (default after login)
  if (currentPage === 'dashboard' || currentPage === 'financial') {
    return <FinancialDashboard onNavigate={navigate} onLogout={handleLogout} />;
  }

  // placeholder for staff page - feature 2 is in a different branch
  if (currentPage === 'staff') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Staff Management</h2>
        <p>This feature is implemented in the <strong>feature/f2-staff-management</strong> branch.</p>
        <button onClick={() => navigate('dashboard')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // placeholder for inventory page - feature 3 is in a different branch
  if (currentPage === 'inventory') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Parts Inventory</h2>
        <p>This feature is implemented in the <strong>feature/f3-parts-inventory</strong> branch.</p>
        <button onClick={() => navigate('dashboard')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // default fallback to login
  return <Login onNavigate={navigate} />;
}

export default App;
