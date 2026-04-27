import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import CustomerCard from '../components/CustomerCard';
import { Search, Loader2 } from 'lucide-react';

const StaffSearch = () => {
  const [query, setQuery] = useState({ type: 'name', value: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/staff/customers/search?type=${query.type}&value=${query.value}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Customer Search</h1>
        <p className="page-subtitle">Quickly find customer profiles by name, phone, email, or vehicle number.</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: '1' }}>
            <label className="form-label">Search By</label>
            <select 
              className="form-input" 
              value={query.type} 
              onChange={(e) => setQuery({ ...query, type: e.target.value })}
            >
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="id">Customer ID</option>
              <option value="vehiclenumber">Vehicle Number</option>
            </select>
          </div>
          <div style={{ flex: '3' }}>
            <label className="form-label">Search Value</label>
            <input
              className="form-input"
              type="text"
              placeholder={`Enter ${query.type}...`}
              value={query.value}
              onChange={(e) => setQuery({ ...query, value: e.target.value })}
              required
            />
          </div>
          <button className="btn-primary" type="submit" style={{ height: '45px' }}>
            {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
            Search
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {results.length > 0 ? (
          results.map((c) => <CustomerCard key={c.profileId} customer={c} />)
        ) : (
          !loading && query.value && <p style={{ color: 'var(--text-muted)' }}>No customers found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default StaffSearch;