import React, { useState, useEffect } from 'react';
import { getAllParts, createPart, updatePart, deletePart, stockIn } from './partsAPI';
import './PartsInventory.css';

// PartsInventory - Feature 3: Parts Inventory Management
// this page shows all vehicle parts and lets admin do full CRUD
function PartsInventory({ onNavigate, onLogout }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  // the part currently being edited or stocked
  const [currentPart, setCurrentPart] = useState(null);
  const [stockQty, setStockQty] = useState(1);

  // form data for add/edit
  const [formData, setFormData] = useState({
    name: '', category: '', partNumber: '', price: '', stock: '', description: '', vendorID: 1, lowStockThreshold: 10,
  });

  const userName = localStorage.getItem('userName') || 'Admin';

  // load all parts when page opens
  useEffect(() => {
    fetchParts();
  }, []);

  // call the API to get all parts
  const fetchParts = async () => {
    setLoading(true);
    try {
      const { ok, data } = await getAllParts();
      if (ok) {
        setParts(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load parts');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // update form when user types
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // open add modal with empty form
  const openAddModal = () => {
    setFormData({ name: '', category: '', partNumber: '', price: '', stock: '', description: '', vendorID: 1, lowStockThreshold: 10 });
    setIsAddModalOpen(true);
  };

  // open edit modal with current part data
  const openEditModal = (part) => {
    setCurrentPart(part);
    setFormData({
      name: part.name,
      category: part.category,
      partNumber: part.partNumber,
      price: part.price,
      stock: part.stock,
      description: part.description || '',
      vendorID: part.vendorID || 1,
      lowStockThreshold: part.lowStockThreshold || 10,
    });
    setIsEditModalOpen(true);
  };

  // open stock-in modal for a specific part
  const openStockModal = (part) => {
    setCurrentPart(part);
    setStockQty(1);
    setIsStockModalOpen(true);
  };

  // submit add part form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ok, data } = await createPart({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        vendorID: parseInt(formData.vendorID),
      });
      if (ok) {
        setIsAddModalOpen(false);
        fetchParts();
      } else {
        alert(data.message || 'Failed to add part');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // submit edit part form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { ok } = await updatePart(currentPart.partID, {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
      });
      if (ok) {
        setIsEditModalOpen(false);
        fetchParts();
      } else {
        alert('Failed to update part');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // add stock to a part
  const handleStockIn = async (e) => {
    e.preventDefault();
    try {
      const { ok } = await stockIn(currentPart.partID, parseInt(stockQty));
      if (ok) {
        setIsStockModalOpen(false);
        fetchParts();
      } else {
        alert('Failed to add stock');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // delete a part
  const handleDelete = async (part) => {
    if (!window.confirm(`Delete part: ${part.name}?`)) return;
    try {
      const { ok } = await deletePart(part.partID);
      if (ok) {
        fetchParts();
      } else {
        alert('Failed to delete part');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    onLogout();
  };

  // filter parts based on search input
  const filteredParts = parts.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // show stock level color based on quantity
  const getStockColor = (stock) => {
    if (stock < 10) return '#ef4444';
    if (stock < 30) return '#f59e0b';
    return '#10b981';
  };

  // summary stats for the top cards
  const totalParts = parts.length;
  const lowStock = parts.filter(p => p.stock < 10).length;
  const totalValue = parts.reduce((sum, p) => sum + (p.price * p.stock || 0), 0);

  return (
    <div className="inventory-layout">
      // sidebar navigation
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>AUTOPART PRO</h2>
          <p>AUTOMOTIVE MANAGEMENT</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            Dashboard / Inventory
          </div>
          // clicking staff goes to staff page
          <div className="nav-item" onClick={() => onNavigate('staff')} style={{ cursor: 'pointer' }}>
            Staff
          </div>
          <div className="nav-item">Financials</div>
          <div className="nav-item">Vendors</div>
          <div className="nav-item">Customers</div>
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item">Settings</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      // main content
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>Parts Inventory</h1>
            // search bar
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="topbar-right">
            <span className="user-name">{userName}</span>
          </div>
        </header>

        <div className="dashboard-content">
          // page header with add button
          <div className="page-header">
            <div>
              <h2>Parts Management</h2>
              <p>Manage vehicle parts stock and pricing.</p>
            </div>
            <button className="btn-primary" onClick={openAddModal}>
              Add New Part
            </button>
          </div>

          // summary stat cards
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">TOTAL PARTS</span>
              <h3 className="stat-value">{totalParts}</h3>
            </div>
            <div className="stat-card">
              <span className="stat-label">LOW STOCK ALERTS</span>
              <h3 className="stat-value" style={{ color: '#ef4444' }}>{lowStock}</h3>
            </div>
            <div className="stat-card">
              <span className="stat-label">TOTAL STOCK VALUE</span>
              <h3 className="stat-value">£{totalValue.toLocaleString()}</h3>
            </div>
          </div>

          // parts table
          <div className="table-container">
            {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}

            <table className="inventory-table">
              <thead>
                <tr>
                  <th>PART NAME</th>
                  <th>PART NUMBER</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading parts...</td></tr>
                ) : filteredParts.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No parts found.</td></tr>
                ) : (
                  filteredParts.map(part => (
                    <tr key={part.partID}>
                      <td>
                        <div>
                          <span style={{ fontWeight: 600 }}>{part.name}</span>
                          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{part.description}</p>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{part.partNumber}</td>
                      <td>{part.category}</td>
                      <td style={{ fontWeight: 600 }}>£{Number(part.price).toFixed(2)}</td>
                      <td>
                        // show stock with a color indicator
                        <span style={{ color: getStockColor(part.stock), fontWeight: 600 }}>
                          {part.stock} units
                        </span>
                      </td>
                      <td className="actions-cell">
                        // stock in button
                        <button onClick={() => openStockModal(part)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }}>Stock In</button>
                        // edit button
                        <button onClick={() => openEditModal(part)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}>Edit</button>
                        // delete button
                        <button onClick={() => handleDelete(part)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      // add part modal
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Part</h3>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Part Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Brake Pad" />
                </div>
                <div className="form-group">
                  <label>Part Number</label>
                  <input required name="partNumber" value={formData.partNumber} onChange={handleInputChange} placeholder="e.g. BP-2024-001" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input required name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Brakes" />
                </div>
                <div className="form-group">
                  <label>Price (£)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Initial Stock</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input name="description" value={formData.description} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Part</button>
              </div>
            </form>
          </div>
        </div>
      )}

      // edit part modal
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Part</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Part Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input required name="category" value={formData.category} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Price (£)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input name="description" value={formData.description} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      // stock in modal
      {isStockModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Stock — {currentPart?.name}</h3>
              <button className="close-btn" onClick={() => setIsStockModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleStockIn}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Quantity to Add</label>
                  <input
                    type="number"
                    min="1"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsStockModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Confirm Stock In</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartsInventory;
