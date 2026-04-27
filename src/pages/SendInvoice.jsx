import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const SendInvoice = () => {
  const location = useLocation();
  const [form, setForm] = useState({
    toEmail: '',
    customerName: '',
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: 0
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    if (location.state?.customer) {
      const c = location.state.customer;
      setForm(prev => ({ ...prev, toEmail: c.email, customerName: c.fullName }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await axiosClient.post('/api/invoices/send-email', {
        ToEmail: form.toEmail,
        CustomerName: form.customerName,
        InvoiceNumber: form.invoiceNumber,
        Amount: form.amount
      });
      setStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Send Invoice</h1>
        <p className="page-subtitle">Send a professional invoice notification to your customer via email.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        {status.success && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} />
            Invoice email sent successfully!
          </div>
        )}

        {status.error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                className="form-input"
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Recipient Email</label>
              <input
                className="form-input"
                type="email"
                value={form.toEmail}
                onChange={(e) => setForm({ ...form, toEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Invoice #</label>
              <input
                className="form-input"
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount ($)</label>
              <input
                className="form-input"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={status.loading} style={{ width: '100%', marginTop: '1rem' }}>
            {status.loading ? 'Sending...' : 'Send Invoice Email'}
            {!status.loading && <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendInvoice;