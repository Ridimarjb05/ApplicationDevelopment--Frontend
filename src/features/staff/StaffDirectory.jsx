import React, { useState, useEffect } from 'react';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from './staffAPI';
import './StaffDirectory.css';

// StaffDirectory - Feature 2: Staff Management
// this page shows all staff members and lets admin add, edit, or remove them
function StaffDirectory({ onNavigate, onLogout }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal visibility state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // the staff member being edited
  const [currentStaff, setCurrentStaff] = useState(null);

  // form data for add and edit forms
  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '', role: 'Staff'
  });

  // shown after adding a staff member - their temporary password
  const [tempPassword, setTempPassword] = useState('');

  const userName = localStorage.getItem('userName') || 'Admin';

  // load all staff when the page opens
  useEffect(() => {
    fetchStaff();
  }, []);

  // call the API to get all staff members
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { ok, data } = await getAllStaff();
      if (ok) {
        setStaff(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to load staff');
      }
    } catch (err) {
      setError('Network error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  // update form state when user types
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // open the add staff modal
  const openAddModal = () => {
    setFormData({ fullName: '', email: '', phoneNumber: '', role: 'Staff' });
    setTempPassword('');
    setIsAddModalOpen(true);
  };

  // open the edit staff modal with current data filled in
  const openEditModal = (member) => {
    setCurrentStaff(member);
    setFormData({
      fullName: `${member.firstName} ${member.lastName}`,
      email: member.email,
      phoneNumber: member.phone,
      role: member.position || 'Staff',
    });
    setIsEditModalOpen(true);
  };

  // submit add staff form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    // split full name into first and last
    const parts = formData.fullName.split(' ');
    const firstName = parts[0] || 'Unknown';
    const lastName = parts.slice(1).join(' ') || 'User';

    const payload = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phoneNumber,
      position: formData.role,
      password: 'TempPassword123!',
      address: 'HQ',
      hireDate: new Date().toISOString(),
    };

    try {
      const { ok, data } = await createStaff(payload);
      if (ok) {
        // show the temporary password to the admin
        setTempPassword('TempPassword123!');
        fetchStaff();
      } else {
        alert(data.message || 'Failed to add staff');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // submit edit staff form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const parts = formData.fullName.split(' ');
    const payload = {
      firstName: parts[0] || 'Unknown',
      lastName: parts.slice(1).join(' ') || 'User',
      phone: formData.phoneNumber,
      position: formData.role,
    };

    try {
      const { ok } = await updateStaff(currentStaff.staffID, payload);
      if (ok) {
        setIsEditModalOpen(false);
        fetchStaff();
      } else {
        alert('Failed to update staff');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // delete a staff member
  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.firstName} ${member.lastName}?`)) return;
    try {
      const { ok } = await deleteStaff(member.staffID);
      if (ok) {
        fetchStaff();
      } else {
        alert('Failed to delete staff');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // logout and clear local storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    onLogout();
  };

  // get initials from first and last name for the avatar
  const getInitials = (first, last) => {
    if (!first) return 'U';
    return (first[0] + (last ? last[0] : '')).toUpperCase();
  };

  // stats for the cards at the top
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const admins = staff.filter(s => s.position === 'Admin').length;

  return (
    <div className="inventory-layout">
      // sidebar navigation
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>AUTOPART PRO</h2>
          <p>AUTOMOTIVE MANAGEMENT</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => onNavigate('inventory')} style={{ cursor: 'pointer' }}>
            Dashboard
          </div>
          <div className="nav-item" onClick={() => onNavigate('inventory')} style={{ cursor: 'pointer' }}>
            Inventory
          </div>
          // staff is the active page
          <div className="nav-item active">
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

      // main content area
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>Staff Directory</h1>
          </div>
          <div className="topbar-right">
            <span className="user-name">{userName}</span>
          </div>
        </header>

        <div className="dashboard-content">
          // page title and add button
          <div className="page-header">
            <div>
              <h2>Staff Management</h2>
              <p>Manage team access and roles.</p>
            </div>
            <button className="btn-primary" onClick={openAddModal}>
              Add New Staff
            </button>
          </div>

          // stats cards
          <div className="staff-stats-grid">
            <div className="staff-stat-card">
              <span className="staff-stat-title">TOTAL STAFF</span>
              <h3 className="staff-stat-value">{totalStaff}</h3>
            </div>
            <div className="staff-stat-card">
              <span className="staff-stat-title">ACTIVE</span>
              <h3 className="staff-stat-value">{activeStaff}</h3>
            </div>
            <div className="staff-stat-card">
              <span className="staff-stat-title">ADMINS</span>
              <h3 className="staff-stat-value">{admins}</h3>
            </div>
          </div>

          // staff table
          <div className="table-container">
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table className="inventory-table">
              <thead>
                <tr>
                  <th>STAFF MEMBER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading staff...</td></tr>
                ) : staff.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No staff members found.</td></tr>
                ) : (
                  staff.map(member => (
                    <tr key={member.staffID}>
                      <td>
                        <div className="staff-avatar-cell">
                          <div className="staff-avatar">
                            {getInitials(member.firstName, member.lastName)}
                          </div>
                          <span>{member.firstName} {member.lastName}</span>
                        </div>
                      </td>
                      <td>{member.email}</td>
                      <td><span className="role-badge">{member.position}</span></td>
                      <td>
                        <span className={member.status === 'Active' ? 'status-active' : 'status-inactive'}>
                          {member.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        // edit button
                        <button onClick={() => openEditModal(member)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}>Edit</button>
                        // delete button
                        <button onClick={() => handleDelete(member)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      // add staff modal
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{tempPassword ? 'Staff Created' : 'Add New Staff'}</h3>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            {tempPassword ? (
              // show temp password after creating staff
              <div className="modal-body">
                <p>Temporary password for new staff member:</p>
                <div style={{ fontFamily: 'monospace', background: '#dcfce3', padding: '0.5rem', borderRadius: '4px', margin: '1rem 0', fontSize: '1.1rem' }}>
                  {tempPassword}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Share this password securely with the staff member.</p>
                <button className="btn-submit" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setIsAddModalOpen(false)}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Jane Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange}>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit">Create Staff</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      // edit staff modal
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Staff</h3>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange}>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
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
    </div>
  );
}

export default StaffDirectory;
