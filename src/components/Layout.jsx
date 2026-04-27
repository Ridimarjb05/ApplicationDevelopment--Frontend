import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="header-search">
            <input type="text" placeholder="Quick search..." className="search-input" />
          </div>
          <div className="user-profile-mini">
            <div className="user-info">
              <span className="user-name">Prabhat LC</span>
              <span className="user-role">Administrator</span>
            </div>
            <div className="user-avatar">PL</div>
          </div>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
