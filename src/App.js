import './App.css';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Mail, 
  User, 
  Send, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:5005/api';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

async function apiJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch(e) {}
  
  if (!res.ok) {
    const msg = typeof body === 'string' ? body : body?.message || body?.title || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

function PageWrapper({ children }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function Layout({ children }) {
  const nav = useNavigate();

  function handleLogout() {
    localStorage.removeItem('vp_customer_id');
    nav('/register');
  }

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={32} color="var(--primary)" />
          <span>VehiclePortal</span>
        </div>
        <nav className="nav-menu">
          <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <UserPlus size={20} />
            <span>Register</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>Manage Profile</span>
          </NavLink>
          <NavLink to="/staff-search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={20} />
            <span>Staff Search</span>
          </NavLink>
          <NavLink to="/send-invoices" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Mail size={20} />
            <span>Send Invoices</span>
          </NavLink>
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button 
            onClick={handleLogout}
            className="nav-link" 
            style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
    </div>
  );
}

function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    plateNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function validate() {
    if (!form.fullName.trim()) return 'Full Name is required.';
    const phone = (form.phoneNumber || '').replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(phone)) return 'Phone must be 10 digits.';
    if (!/^[^@\s]+@gmail\.com$/i.test(form.email.trim())) return 'Email must be a valid @gmail.com address.';
    if (!form.plateNumber.trim() || !form.brand.trim() || !form.model.trim()) return 'Vehicle Plate, Brand, and Model are required.';
    const year = Number(form.year);
    const maxYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < 1970 || year > maxYear) return 'Vehicle year is invalid.';
    return '';
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) return setError(v);

    setBusy(true);
    try {
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        plateNumber: form.plateNumber,
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
      };
      const result = await apiJson('/customers/register', { method: 'POST', body: JSON.stringify(payload) });
      localStorage.setItem('vp_customer_id', result.id);
      nav(`/profile/${result.id}`);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageWrapper>
      <h1>Customer Registration</h1>
      <p className="subtitle">Register new customers and their primary vehicle fleet.</p>
      
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="98XXXXXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">Gmail Address</label>
              <input className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@gmail.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Plate</label>
              <input className="form-input" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} placeholder="BA-1-PA-1234" />
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input className="form-input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Toyota" />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input className="form-input" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Corolla" />
            </div>
            <div className="form-group">
              <label className="form-label">Manufacture Year</label>
              <input className="form-input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
          </div>

          {error && <div className="status-box status-error"><AlertCircle size={18} /> {error}</div>}
          
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
            {busy ? 'Registering...' : 'Register Customer'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

function StaffSearchPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('Name');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function runSearch(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const qs = new URLSearchParams({ type, query });
      const list = await apiJson(`/customers/search?${qs.toString()}`);
      setResults(list);
    } catch (err) {
      setError(err.message || String(err));
      setResults([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageWrapper>
      <h1>Staff Customer Search</h1>
      <p className="subtitle">Find customers by name, phone, ID, or vehicle plate number.</p>

      <div className="card">
        <form onSubmit={runSearch} className="form-grid" style={{ alignItems: 'flex-end', marginBottom: 0 }}>
          <div className="form-group">
            <label className="form-label">Search Category</label>
            <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Name">Full Name</option>
              <option value="PhoneNumber">Phone Number</option>
              <option value="CustomerId">Customer ID</option>
              <option value="VehiclePlateNumber">Vehicle Plate</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Search Query</label>
            <input className="form-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter search term..." />
          </div>
          <button className="btn btn-primary" disabled={busy} style={{ height: '48px' }}>
            {busy ? <Loader2 className="animate-spin" /> : <Search size={18} />}
            Search
          </button>
        </form>
        {error && <div className="status-box status-error" style={{ marginTop: '1.5rem' }}>{error}</div>}
      </div>

      {results !== null && (
        <div className="card fade-in" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>Vehicle Plates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{c.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {c.id}</div>
                    </td>
                    <td>
                      <div>{c.phoneNumber}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {(c.vehiclePlateNumbers || []).map(p => (
                          <span key={p} className="badge badge-primary">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="vp-actions">
                        <button className="btn" onClick={() => navigate(`/profile/${c.id}`)} style={{ padding: '0.5rem' }}>
                           <User size={18} color="var(--primary)" />
                        </button>
                        <button className="btn" onClick={() => navigate(`/send-invoices?customerId=${c.id}`)} style={{ padding: '0.5rem' }}>
                           <Mail size={18} color="var(--secondary)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No matches found in the database.
              </div>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

function SendInvoicesPage() {
  const q = useQuery();
  const deepCustomerId = q.get('customerId') || '';

  const [customerId, setCustomerId] = useState(deepCustomerId);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ subject: '', description: '', amount: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!customerId) return setInvoices([]);
    try {
      const list = await apiJson(`/invoices?customerId=${encodeURIComponent(customerId)}`);
      setInvoices(list);
    } catch (err) {
      setInvoices([]);
    }
  }

  useEffect(() => {
    setCustomerId(deepCustomerId);
  }, [deepCustomerId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  async function send(e) {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (!customerId) return setStatus({ type: 'error', msg: 'CustomerId is required.' });
    if (!form.subject.trim() || !form.description.trim()) return setStatus({ type: 'error', msg: 'Subject and Description are required.' });
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return setStatus({ type: 'error', msg: 'Amount must be > 0.' });

    setBusy(true);
    try {
      await apiJson('/invoices/send', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          subject: form.subject,
          description: form.description,
          amount,
        }),
      });
      setStatus({ type: 'success', msg: 'Invoice sent successfully via SMTP.' });
      setForm({ subject: '', description: '', amount: '' });
      await load();
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Failed to send invoice.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageWrapper>
      <h1>Electronic Invoices</h1>
      <p className="subtitle">Create and send professional invoices directly to customer emails.</p>

      <div className="card">
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label">Customer ID (Auto-filled from Search)</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input className="form-input" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="Customer GUID" />
            <button className="btn btn-primary" onClick={load} disabled={busy}><Loader2 className={busy ? 'animate-spin' : ''} size={18} /> Refresh</button>
          </div>
        </div>

        <form onSubmit={send}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Invoice Subject</label>
              <input className="form-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Service Fee" />
            </div>
            <div className="form-group">
              <label className="form-label">Total Amount (Rs.)</label>
              <input className="form-input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1500" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description / Items</label>
              <textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Detail the services provided..." />
            </div>
          </div>

          {status.msg && (
            <div className={`status-box status-${status.type}`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.msg}
            </div>
          )}

          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {busy ? 'Sending...' : 'Send Invoice Email'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Recent Invoices</h3>
        <div style={{ marginTop: '1.5rem' }}>
          {invoices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No invoice history found.</div>
          ) : (
            invoices.map((x) => (
              <div key={x.id} className="invoice-item">
                <div className="invoice-meta">
                  <div style={{ fontWeight: 700 }}>{x.subject}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sent to: {x.sentToEmail}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Rs. {Number(x.amount).toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(x.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

function ProfileDashboardPage() {
  const params = useParams();
  const nav = useNavigate();
  const routeId = params.id || '';

  const [lookup, setLookup] = useState({ customerId: routeId, plateNumber: '' });
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const [editInfo, setEditInfo] = useState({ fullName: '', phoneNumber: '', email: '' });
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', brand: '', model: '', year: new Date().getFullYear() });
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vp_customer_id');
    const targetId = routeId || saved;
    
    if (targetId) {
      setLookup((x) => ({ ...x, customerId: targetId }));
      
      // Auto-load if we have an ID
      setBusy(true);
      setError('');
      apiJson(`/customers/${encodeURIComponent(targetId)}`)
        .then(c => {
          hydrate(c);
          localStorage.setItem('vp_customer_id', c.id);
          if (routeId !== String(c.id)) {
            nav(`/profile/${c.id}`, { replace: true });
          }
        })
        .catch(err => {
          setError(err.message || String(err));
          setCustomer(null);
        })
        .finally(() => setBusy(false));
    }
  }, [routeId, nav]);

  function hydrate(c) {
    setCustomer(c);
    setEditInfo({ fullName: c.fullName || '', phoneNumber: c.phoneNumber || '', email: c.email || '' });
  }

  async function loadById() {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const c = await apiJson(`/customers/${encodeURIComponent(lookup.customerId)}`);
      hydrate(c);
      localStorage.setItem('vp_customer_id', c.id);
      nav(`/profile/${c.id}`, { replace: true });
    } catch (err) {
      setError(err.message || String(err));
      setCustomer(null);
    } finally {
      setBusy(false);
    }
  }

  async function loadByPlate() {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const c = await apiJson(`/customers/by-plate/${encodeURIComponent(lookup.plateNumber)}`);
      hydrate(c);
      localStorage.setItem('vp_customer_id', c.id);
      nav(`/profile/${c.id}`, { replace: true });
    } catch (err) {
      setError(err.message || String(err));
      setCustomer(null);
    } finally {
      setBusy(false);
    }
  }

  async function saveInfo(e) {
    e.preventDefault();
    if (!customer?.id) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const updated = await apiJson(`/customers/${customer.id}`, {
        method: 'PUT',
        body: JSON.stringify(editInfo),
      });
      hydrate(updated);
      setStatus('Personal info updated successfully.');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  async function addVehicle(e) {
    e.preventDefault();
    if (!customer?.id) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const updated = await apiJson(`/customers/${customer.id}/vehicles`, {
        method: 'POST',
        body: JSON.stringify({ ...newVehicle, year: Number(newVehicle.year) }),
      });
      hydrate(updated);
      setNewVehicle({ plateNumber: '', brand: '', model: '', year: new Date().getFullYear() });
      setIsAddingVehicle(false);
      setStatus('New vehicle added to fleet.');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  async function updateVehicle(vehicleId, patch) {
    if (!customer?.id) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const updated = await apiJson(`/customers/${customer.id}/vehicles/${vehicleId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...patch, year: Number(patch.year) }),
      });
      hydrate(updated);
      setStatus('Vehicle details updated.');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  async function deleteVehicle(vehicleId) {
    if (!customer?.id) return;
    if (!window.confirm('Remove this vehicle?')) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const updated = await apiJson(`/customers/${customer.id}/vehicles/${vehicleId}`, { method: 'DELETE' });
      hydrate(updated);
      setStatus('Vehicle removed.');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    if (!customer?.id) return;
    if (!window.confirm('Delete your entire account? This action is permanent.')) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await apiJson(`/customers/${customer.id}`, { method: 'DELETE' });
      localStorage.removeItem('vp_customer_id');
      nav('/register');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageWrapper>
      <h1>Unified Profile Dashboard</h1>
      <p className="subtitle">Manage personal information and registered vehicle fleets.</p>

      <div className="card">
        <div className="form-grid" style={{ marginBottom: 0 }}>
          <div className="form-group">
            <label className="form-label">Search by ID</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-input" value={lookup.customerId} onChange={(e) => setLookup({ ...lookup, customerId: e.target.value })} placeholder="GUID" />
              <button className="btn btn-primary" onClick={loadById} disabled={busy}>Load</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Search by Plate</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-input" value={lookup.plateNumber} onChange={(e) => setLookup({ ...lookup, plateNumber: e.target.value })} placeholder="Plate #" />
              <button className="btn btn-primary" onClick={loadByPlate} disabled={busy}>Load</button>
            </div>
          </div>
        </div>
        {error && <div className="status-box status-error" style={{ marginTop: '1.5rem' }}>{error}</div>}
        {status && <div className="status-box status-success" style={{ marginTop: '1.5rem' }}>{status}</div>}
      </div>

      {customer && (
        <div className="fade-in">
          <div className="card">
            <h3>Personal Information</h3>
            <form onSubmit={saveInfo} style={{ marginTop: '1.5rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={editInfo.fullName} onChange={(e) => setEditInfo({ ...editInfo, fullName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={editInfo.phoneNumber} onChange={(e) => setEditInfo({ ...editInfo, phoneNumber: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Email Address</label>
                  <input className="form-input" value={editInfo.email} onChange={(e) => setEditInfo({ ...editInfo, email: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" disabled={busy}><CheckCircle2 size={18} /> Update Info</button>
                <button type="button" className="btn btn-danger" onClick={deleteAccount} disabled={busy}><Trash2 size={18} /> Delete Account</button>
              </div>
            </form>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Vehicle Fleet</h3>
              <button className="btn btn-primary" onClick={() => setIsAddingVehicle(true)} style={{ padding: '0.5rem 1rem' }}>
                <Plus size={18} /> Add Vehicle
              </button>
            </div>

            {isAddingVehicle && (
              <div className="card" style={{ background: '#f8fafc', borderStyle: 'dashed' }}>
                <form onSubmit={addVehicle}>
                  <div className="form-grid">
                    <input className="form-input" placeholder="Plate #" value={newVehicle.plateNumber} onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value})} />
                    <input className="form-input" placeholder="Brand" value={newVehicle.brand} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} />
                    <input className="form-input" placeholder="Model" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                    <input className="form-input" type="number" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary">Save Vehicle</button>
                    <button type="button" className="btn" onClick={() => { setIsAddingVehicle(false); setNewVehicle({ plateNumber: '', brand: '', model: '', year: new Date().getFullYear() }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Plate Number</th>
                    <th>Brand & Model</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.vehicles.map((v) => (
                    <VehicleRow 
                      key={v.id} 
                      vehicle={v} 
                      busy={busy} 
                      onSave={(patch) => updateVehicle(v.id, patch)} 
                      onDelete={() => deleteVehicle(v.id)} 
                    />
                  ))}
                </tbody>
              </table>
              {customer.vehicles.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles registered.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

function VehicleRow({ vehicle, onSave, onDelete, busy }) {
  const [edit, setEdit] = useState(vehicle);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <tr>
        <td><input className="form-input" value={edit.plateNumber} onChange={e => setEdit({...edit, plateNumber: e.target.value})} /></td>
        <td>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input className="form-input" value={edit.brand} onChange={e => setEdit({...edit, brand: e.target.value})} />
            <input className="form-input" value={edit.model} onChange={e => setEdit({...edit, model: e.target.value})} />
          </div>
        </td>
        <td><input className="form-input" type="number" value={edit.year} onChange={e => setEdit({...edit, year: e.target.value})} /></td>
        <td>
          <div className="vp-actions">
            <button className="btn btn-primary" onClick={() => { onSave(edit); setIsEditing(false); }} disabled={busy}>Save</button>
            <button className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td style={{ fontWeight: 800 }}>{vehicle.plateNumber}</td>
      <td>{vehicle.brand} {vehicle.model}</td>
      <td>{vehicle.year}</td>
      <td>
        <div className="vp-actions">
          <button className="btn" onClick={() => setIsEditing(true)}><LayoutDashboard size={18} color="var(--primary)" /></button>
          <button className="btn" onClick={onDelete} disabled={busy}><Trash2 size={18} color="var(--error)" /></button>
        </div>
      </td>
    </tr>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff-search" element={<StaffSearchPage />} />
        <Route path="/send-invoices" element={<SendInvoicesPage />} />
        <Route path="/profile" element={<ProfileDashboardPage />} />
        <Route path="/profile/:id" element={<ProfileDashboardPage />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
