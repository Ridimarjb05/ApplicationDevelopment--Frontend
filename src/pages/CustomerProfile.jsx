import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { User, Car, Plus, Trash2, Save, Loader2, Edit3, X } from 'lucide-react';

const CustomerProfile = () => {
  const location = useLocation();
  const [profileId, setProfileId] = useState('');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newVehicle, setNewVehicle] = useState({ vehicleNumber: '', make: '', model: '', year: new Date().getFullYear() });
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    if (location.state?.profileId) {
      setProfileId(location.state.profileId);
      // We can't call fetchProfile directly because profileId state update is async
      // So we use a manual fetch or useEffect on profileId
    }
  }, [location.state]);

  // Handle auto-fetch when profileId is set via state
  useEffect(() => {
    if (profileId && location.state?.profileId === profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/customers/${profileId}`);
      setCustomer(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/customers/${profileId}`, { FullName: customer.fullName, Phone: customer.phone });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/customers/${profileId}/vehicles`, newVehicle);
      setNewVehicle({ vehicleNumber: '', make: '', model: '', year: new Date().getFullYear() });
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/customers/${profileId}/vehicles/${editingVehicle.id}`, editingVehicle);
      setEditingVehicle(null);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Remove this vehicle?')) return;
    try {
      await axiosClient.delete(`/api/customers/${profileId}/vehicles/${vehicleId}`);
      fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Manage Profile</h1>
        <p className="page-subtitle">Update customer information and manage their vehicle collection.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <input
          className="form-input"
          type="number"
          placeholder="Enter Profile ID..."
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
        />
        <button className="btn-primary" onClick={fetchProfile} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <User size={18} />}
          Load Profile
        </button>
      </div>

      {customer && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Profile Edit */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Edit3 size={20} color="var(--primary)" /> Profile Details
            </h3>
            {message && <p style={{ color: '#4ade80', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</p>}
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={customer.fullName} onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              </div>
              <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>

          {/* Vehicles Management */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Car size={20} color="var(--accent)" /> Vehicle Collection
            </h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              {customer.vehicles?.map(v => (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{v.make} {v.model}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.vehicleNumber} • {v.year}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setEditingVehicle(v)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDeleteVehicle(v.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {customer.vehicles?.length === 0 && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No vehicles found.</p>}
            </div>

            {/* Add or Edit Vehicle Form */}
            <form onSubmit={editingVehicle ? handleUpdateVehicle : handleAddVehicle} style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.875rem' }}>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h5>
                {editingVehicle && (
                  <button onClick={() => setEditingVehicle(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input 
                  className="form-input" 
                  placeholder="Number" 
                  value={editingVehicle ? editingVehicle.vehicleNumber : newVehicle.vehicleNumber} 
                  onChange={(e) => editingVehicle ? setEditingVehicle({...editingVehicle, vehicleNumber: e.target.value}) : setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })} 
                  required 
                />
                <input 
                  className="form-input" 
                  placeholder="Make" 
                  value={editingVehicle ? editingVehicle.make : newVehicle.make} 
                  onChange={(e) => editingVehicle ? setEditingVehicle({...editingVehicle, make: e.target.value}) : setNewVehicle({ ...newVehicle, make: e.target.value })} 
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input 
                  className="form-input" 
                  placeholder="Model" 
                  value={editingVehicle ? editingVehicle.model : newVehicle.model} 
                  onChange={(e) => editingVehicle ? setEditingVehicle({...editingVehicle, model: e.target.value}) : setNewVehicle({ ...newVehicle, model: e.target.value })} 
                  required 
                />
                <input 
                  className="form-input" 
                  type="number" 
                  placeholder="Year" 
                  value={editingVehicle ? editingVehicle.year : newVehicle.year} 
                  onChange={(e) => editingVehicle ? setEditingVehicle({...editingVehicle, year: parseInt(e.target.value)}) : setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })} 
                  required 
                />
              </div>
              <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem', background: 'var(--bg-dark)', border: '1px solid var(--primary)' }}>
                {editingVehicle ? <><Save size={18} /> Update Vehicle</> : <><Plus size={18} /> Add Vehicle</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;