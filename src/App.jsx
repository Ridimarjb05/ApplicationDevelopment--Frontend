import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import RegisterCustomer from './pages/RegisterCustomer';
import StaffSearch from './pages/StaffSearch';
import SendInvoice from './pages/SendInvoice';
import CustomerProfile from './pages/CustomerProfile';
import axiosClient from './api/axiosClient';
import { 
  Search, Mail, Users, ArrowUpRight, Activity, 
  Database, Clock, CheckCircle, AlertCircle, PlusCircle
} from 'lucide-react';
import './App.css';

const DashboardHome = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ totalCustomers: 0, totalVehicles: 0, systemStatus: 'Syncing' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [recentRes, statsRes] = await Promise.all([
          axiosClient.get('/api/staff/customers/recent?count=4'),
          axiosClient.get('/api/staff/stats')
        ]);
        setRecentActivity(recentRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Operations Command Center</h1>
        <p className="page-subtitle">Real-time oversight of vehicle parts sales, customer relations, and invoicing cycles.</p>
      </div>
      
      {/* Real Statistics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Users size={20} color="var(--primary)" />
            </div>
            <span style={{ color: '#4ade80', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>Real-time <ArrowUpRight size={14} /></span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalCustomers}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Registered Customers</div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Database size={20} color="var(--accent)" />
            </div>
            <span style={{ color: '#4ade80', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>Active <div className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', marginLeft: 8 }}></div></span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalVehicles}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Managed Vehicles</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <Activity size={20} color="#f43f5e" />
            </div>
            <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>{stats.systemStatus}</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>ONLINE</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>System Integrity</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Link to="/register" className="glass-card action-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
              <PlusCircle size={32} color="white" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Register New Customer</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Seamlessly onboard new clients and their primary vehicle details into the central database.</p>
            </div>
          </Link>
          
          <Link to="/staff-search" className="glass-card action-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'var(--accent)', padding: '1rem', borderRadius: '12px' }}>
              <Search size={32} color="white" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Staff Intelligence Hub</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Execute advanced queries across the global customer registry with real-time results.</p>
            </div>
          </Link>

          <Link to="/profile" className="glass-card action-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#4ade80', padding: '1rem', borderRadius: '12px' }}>
              <Database size={32} color="white" />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Customer Self-Service</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Update profiles and manage vehicle CRUD operations for registered customers.</p>
            </div>
          </Link>
        </div>

        {/* Real-time Activity Feed */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary)" /> Live Activity
          </h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '50px', borderRadius: '8px' }}></div>)
            ) : recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity.profileId} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '0.25rem' }}>
                    <CheckCircle size={16} color="#4ade80" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{activity.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered new profile</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary)', marginTop: '2px' }}>{activity.vehicles[0]?.vehicleNumber || "No Vehicle"}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recent registrations found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/staff-search" element={<StaffSearch />} />
        <Route path="/send-invoice" element={<SendInvoice />} />
        <Route path="/profile" element={<CustomerProfile />} />
      </Routes>
    </Layout>
  );
}

export default App;