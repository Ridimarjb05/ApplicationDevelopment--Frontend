import React, { useState } from "react";
import "./PartsInventory.css";

// PartsInventory - Feature 3
// shows the parts management page with inventory table
// admin can view, add, edit and delete parts from this page
function PartsInventory({ onNavigate, onLogout }) {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const userName = localStorage.getItem("userName") || "Admin User";
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  // demo parts data - real app fetches this from the backend
  const allParts = [
    { sku: "AP-HD-9621", name: "Heavy-Duty Brake Caliper", category: "Braking System", categoryColor: "#f59e0b", price: 425.00, stock: 12, maxStock: 50, stockColor: "#f59e0b", barColor: "#f59e0b" },
    { sku: "AP-EN-1644", name: "V8 Cylinder Head Gasket", category: "Engine Components", categoryColor: "#3b82f6", price: 84.95, stock: 142, maxStock: 200, stockColor: "#22c55e", barColor: "#22c55e" },
    { sku: "AP-EL-5528", name: "High-Output Alternator 24V", category: "Electrical", categoryColor: "#8b5cf6", price: 620.00, stock: 54, maxStock: 100, stockColor: "#22c55e", barColor: "#22c55e" },
    { sku: "AP-TR-3381", name: "Drive Shaft Coupler", category: "Transmission", categoryColor: "#64748b", price: 198.50, stock: 4, maxStock: 50, stockColor: "#ef4444", barColor: "#ef4444" },
  ];

  // filter based on search
  const filtered = allParts.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchText.toLowerCase()) ||
    p.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="parts-layout">
      {/* sidebar */}
      <aside className="parts-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">AP</div>
          <div>
            <div className="brand-name">AUTOPART PRO</div>
            <div className="brand-sub">WAREHOUSE MANAGEMENT</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { icon: "⊞", label: "Dashboard", page: "dashboard" },
            { icon: "📦", label: "Inventory", page: "inventory", active: true },
            { icon: "🛒", label: "Sales", page: "sales" },
            { icon: "📊", label: "Reports", page: "reports" },
            { icon: "⚙", label: "Settings", page: "settings" },
          ].map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`} onClick={() => onNavigate && onNavigate(item.page)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="add-sidebar-btn" onClick={() => setShowAddModal(true)}>+ Add New Part</button>
          <button className="logout-btn" onClick={onLogout}><span className="nav-icon">↩</span>Logout</button>
        </div>
      </aside>

      {/* main content */}
      <div className="parts-main">
        {/* top bar */}
        <header className="parts-topbar">
          <div className="topbar-title">Parts Inventory</div>
          <div className="topbar-center">
            <div className="search-bar">
              <span>🔍</span>
              <input type="text" placeholder="Search inventory..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">🕐</button>
            <button className="icon-btn">❓</button>
            <div className="user-info">
              <div>
                <div className="user-name">{userName}</div>
                <div className="user-role-label">SENIOR LOGISTICS MANAGER</div>
              </div>
              <div className="user-avatar">{getInitials(userName)}</div>
            </div>
          </div>
        </header>

        <div className="parts-body">
          {/* page heading */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Parts Management</h1>
              <p className="page-subtitle">Real-time control over industrial vehicle components and stock levels.</p>
            </div>
            <div className="page-actions">
              <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add New Part</button>
              <button className="export-btn">↓ Export CSV</button>
            </div>
          </div>

          {/* 4 stat cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon-box blue">📦</div>
              <div>
                <div className="stat-label">Total SKUs</div>
                <div className="stat-value">4,281</div>
                <div className="stat-change positive">↑12% from last month</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box orange">⚠</div>
              <div>
                <div className="stat-label">Low Stock Items</div>
                <div className="stat-value">24</div>
                <div className="stat-change warning">Action required immediately</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box teal">🚛</div>
              <div>
                <div className="stat-label">In Transit</div>
                <div className="stat-value">118</div>
                <div className="stat-change muted">Estimated arrival: 2 days</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box green">💰</div>
              <div>
                <div className="stat-label">Inventory Value</div>
                <div className="stat-value">$1.2M</div>
                <div className="stat-change muted">Across 3 warehouses</div>
              </div>
            </div>
          </div>

          {/* filters row */}
          <div className="filters-row">
            <div className="filter-group">
              <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option>All Categories</option>
                <option>Braking System</option>
                <option>Engine Components</option>
                <option>Electrical</option>
                <option>Transmission</option>
              </select>
              <select className="filter-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                <option>Stock Level: All</option>
                <option>Low Stock</option>
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="showing-info">Showing 1-10 of 4,281</div>
          </div>

          {/* parts table */}
          <div className="table-card">
            <table className="parts-table">
              <thead>
                <tr>
                  <th>SKU ↕</th>
                  <th>PART NAME ↕</th>
                  <th>CATEGORY</th>
                  <th>UNIT PRICE</th>
                  <th>STOCK LEVEL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((part, i) => {
                  const stockPct = Math.min((part.stock / part.maxStock) * 100, 100);
                  return (
                    <tr key={i}>
                      <td>
                        <div className="sku-cell">
                          <div className="sku-bar" style={{ background: part.barColor }}></div>
                          <span className="sku-code">{part.sku}</span>
                        </div>
                      </td>
                      <td className="part-name">{part.name}</td>
                      <td>
                        <span className="category-badge" style={{ color: part.categoryColor, background: part.categoryColor + "18" }}>
                          {part.category}
                        </span>
                      </td>
                      <td className="price">${part.price.toFixed(2)}</td>
                      <td>
                        <div className="stock-cell">
                          <div className="stock-bar-bg">
                            <div className="stock-bar-fill" style={{ width: `${stockPct}%`, background: part.stockColor }}></div>
                          </div>
                          <span className="stock-count" style={{ color: part.stockColor, background: part.stockColor + "18" }}>
                            {part.stock} units
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn cart" title="Add to Order">🛒</button>
                          <button className="action-btn" title="Edit">✏</button>
                          <button className="action-btn danger" title="Delete">🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* pagination */}
            <div className="pagination">
              <button className="page-btn">Previous</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span className="page-dots">...</span>
              <button className="page-btn">428</button>
              <button className="page-btn">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* add part modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Part</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>Enter the details of the new inventory part.</p>
            <input className="modal-input" type="text" placeholder="Part Name" />
            <input className="modal-input" type="text" placeholder="SKU Code (e.g. AP-BR-0001)" />
            <input className="modal-input" type="text" placeholder="Category" />
            <input className="modal-input" type="number" placeholder="Unit Price ($)" />
            <input className="modal-input" type="number" placeholder="Stock Quantity" />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="add-btn" onClick={() => setShowAddModal(false)}>Add Part</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartsInventory;
