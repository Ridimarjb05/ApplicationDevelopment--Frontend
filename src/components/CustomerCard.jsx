import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, User, Phone, Mail as MailIcon } from 'lucide-react';

const CustomerCard = ({ customer }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: '700' }}>
            {customer.fullName.charAt(0)}
          </div>
          <div>
            <h4 style={{ margin: 0 }}>{customer.fullName}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {customer.profileId}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--bg-dark)', border: '1px solid var(--primary)' }}
            onClick={() => navigate('/profile', { state: { profileId: customer.profileId } })}
          >
            <User size={14} />
            Manage
          </button>
          <button 
            className="btn-primary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
            onClick={() => navigate('/send-invoice', { state: { customer } })}
          >
            <MailIcon size={14} />
            Email Invoice
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Phone size={14} /> {customer.phone}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Mail size={14} /> {customer.email}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h5 style={{ marginBottom: '0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Car size={16} color="var(--accent)" />
          Vehicles ({customer.vehicles?.length || 0})
        </h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {customer.vehicles?.length > 0 ? (
            customer.vehicles.map((v, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                {v.make} {v.model} ({v.vehicleNumber})
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No vehicles registered</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;