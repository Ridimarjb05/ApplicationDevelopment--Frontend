import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { UserPlus, CheckCircle, Car } from 'lucide-react';

const RegisterCustomer = () => {
  const [form, setForm] = useState({ 
    fullName: '', 
    phone: '', 
    email: '',
    vehicleNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear()
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await axiosClient.post('/api/auth/register-customer', form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ 
        fullName: '', 
        phone: '', 
        email: '',
        vehicleNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear()
      });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Register Customer</h1>
        <p className="page-subtitle">Add a new customer and their primary vehicle to the system.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px' }}>
        {status.success && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} />
            Customer and vehicle registered successfully!
          </div>
        )}

        {status.error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Customer Details */}
            <div>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={18} color="var(--primary)" /> Personal Information
              </h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. +1 234 567 890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={18} color="var(--accent)" /> Vehicle Details (Optional)
              </h3>
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. ABC-1234"
                  value={form.vehicleNumber}
                  onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Make</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Toyota"
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Model</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Camry"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={status.loading} style={{ width: '100%', marginTop: '1rem' }}>
            {status.loading ? 'Processing...' : 'Complete Registration'}
            {!status.loading && <UserPlus size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCustomer;