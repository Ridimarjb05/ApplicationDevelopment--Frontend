import React, { useState } from "react";
import "./StaffDirectory.css";

// StaffDirectory - Feature 2
// shows the staff management page with a table of all staff members
// admin can view, edit and manage staff from this page
function StaffDirectory({ onNavigate, onLogout }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const userName = localStorage.getItem("userName") || "Admin User";

  // get initials from name for avatar
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  // demo staff data - in real app this comes from the backend API
  const staffList = [
    { id: "ID #STF-0012", name: "Marcus Holloway", email: "marcus.h@vpsims.com", role: "Inventory Manager", roleColor: "#3b82f6", status: "Active", statusColor: "#22c55e", lastActive: "2 mins ago", avatar: "MH", avatarBg: "#6366f1" },
    { id: "ID #STF-0075", name: "Sarah Chan", email: "s.chen@vpsims.com", role: "Financial Analyst", roleColor: "#8b5cf6", status: "Active", statusColor: "#22c55e", lastActive: "14 mins ago", avatar: "SC", avatarBg: "#ec4899" },
    { id: "ID #STF-0078", name: "David Wilson", email: "d.wilson@vpsims.com", role: "Sales Rep", roleColor: "#f59e0b", status: "On Leave", statusColor: "#f59e0b", lastActive: "2 days ago", avatar: "DW", avatarBg: "#14b8a6" },
    { id: "ID #STF-0021", name: "Jessica Martinez", email: "j.martinez@vpsims.com", role: "Floor Supervisor", roleColor: "#10b981", status: "Active", statusColor: "#22c55e", lastActive: "Just now", avatar: "JM", avatarBg: "#f97316" },
    { id: "ID #STF-0034", name: "Alex Thompson", email: "a.thompson@vpsims.com", role: "Lead Mechanic", roleColor: "#64748b", status: "Offline", statusColor: "#94a3b8", lastActive: "3 hours ago", avatar: "AT", avatarBg: "#3b82f6" },
  ];

  // filter staff based on search input
  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.email.toLowerCase().includes(searchText.toLowerCase()) ||
      s.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="staff-layout">
      {/* dark sidebar */}
      <aside className="staff-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">VP</div>
          <div>
            <div className="brand-name">VPSIMS ADMIN</div>
            <div className="brand-sub">AUTOMOTIVE MANAGEMENT</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { icon: "⊞", label: "Dashboard", page: "dashboard" },
            { icon: "📦", label: "Inventory", page: "inventory" },
            { icon: "👥", label: "Staff", page: "staff", active: true },
            { icon: "💰", label: "Financials", page: "financial" },
            { icon: "🏭", label: "Vendors", page: "vendors" },
            { icon: "🧑‍💼", label: "Customers", page: "customers" },
          ].map((item) => (
            <div
              key={item.label}
              className={`nav-item ${item.active ? "active" : ""}`}
              onClick={() => onNavigate && onNavigate(item.page)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item"><span className="nav-icon">⚙</span>Settings</div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="nav-icon">↩</span>Logout
          </button>
        </div>
      </aside>

      {/* main content */}
      <div className="staff-main">
        {/* top bar */}
        <header className="staff-topbar">
          <div className="topbar-left">
            <span className="topbar-brand">VPSIMS</span>
            <div className="search-bar">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search staff..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">❓</button>
            <div className="user-info">
              <div>
                <div className="user-name">{userName}</div>
                <div className="user-role-label">Super Admin</div>
              </div>
              <div className="user-avatar">{getInitials(userName)}</div>
            </div>
          </div>
        </header>

        <div className="staff-body">
          {/* page heading */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Staff Directory</h1>
              <p className="page-subtitle">Manage organizational access and team roles.</p>
            </div>
            <div className="page-actions">
              <button className="filter-btn">⚙ Filter</button>
              <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add New Staff</button>
            </div>
          </div>

          {/* 4 stat cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon-box blue">👥</div>
              <div>
                <div className="stat-label">TOTAL STAFF</div>
                <div className="stat-value">42</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box green">✅</div>
              <div>
                <div className="stat-label">ACTIVE NOW</div>
                <div className="stat-value">18</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box orange">📋</div>
              <div>
                <div className="stat-label">PENDING TASKS</div>
                <div className="stat-value">7</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box purple">🔑</div>
              <div>
                <div className="stat-label">ADMINS</div>
                <div className="stat-value">5</div>
              </div>
            </div>
          </div>

          {/* staff table */}
          <div className="table-card">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>STAFF MEMBER ↕</th>
                  <th>EMAIL ADDRESS</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>LAST ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((staff, i) => (
                  <tr key={i}>
                    <td>
                      <div className="staff-member-cell">
                        <div className="staff-avatar" style={{ background: staff.avatarBg }}>
                          {staff.avatar}
                        </div>
                        <div>
                          <div className="staff-name">{staff.name}</div>
                          <div className="staff-id">{staff.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="staff-email">{staff.email}</td>
                    <td>
                      <span className="role-badge" style={{ color: staff.roleColor, background: staff.roleColor + "18" }}>
                        {staff.role}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ color: staff.statusColor }}>
                        ● {staff.status}
                      </span>
                    </td>
                    <td className="last-active">{staff.lastActive}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn" title="Edit">✏</button>
                        <button className="action-btn" title="View">👁</button>
                        <button className="action-btn danger" title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* pagination */}
            <div className="pagination">
              <span className="pagination-info">Showing 1 to 5 of 42 entries</span>
              <div className="pagination-btns">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-dots">...</span>
                <button className="page-btn">9</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          </div>

          {/* bottom cards */}
          <div className="bottom-cards">
            <div className="role-card">
              <h3>System Role Definitions</h3>
              <p>Update global permission sets for each staff level. These changes apply immediately to all active sessions.</p>
              <button className="configure-btn">Configure Roles</button>
            </div>
            <div className="audit-card">
              <div className="audit-icon">🔐</div>
              <div>
                <h3>Security Audit</h3>
                <p>Review login logs and failed authentication attempts.</p>
                <a href="#" className="view-logs">View Logs →</a>
              </div>
              <button className="audit-search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>

      {/* add staff modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Staff</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>Fill in the details to add a new staff member.</p>
            <input className="modal-input" type="text" placeholder="Full Name" />
            <input className="modal-input" type="email" placeholder="Email Address" />
            <input className="modal-input" type="text" placeholder="Role (e.g. Inventory Manager)" />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="add-btn" onClick={() => setShowAddModal(false)}>Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDirectory;
