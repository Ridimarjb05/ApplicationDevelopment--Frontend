import React, { useState } from 'react';
import { registerUser } from './authAPI';

// Register page - for creating a new customer account
function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // update form field when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // check passwords match before sending to backend
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (!ok) {
        setError(data.message || 'Registration failed');
      } else {
        // go to login after successful registration
        onNavigate('login');
      }
    } catch (err) {
      setError('Network error. Is your .NET backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', width: '400px' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Register as a new customer</p>

        // show error if something went wrong
        {error && (
          <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <strong style={{ cursor: 'pointer', color: '#3b82f6' }} onClick={() => onNavigate('login')}>
            Sign in
          </strong>
        </p>
      </div>
    </div>
  );
}

export default Register;
