import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { getFinancialReport, getMonthlyRevenue } from './financialAPI';
import './FinancialDashboard.css';

// register all chart.js components so we can use line charts
Chart.register(...registerables);

// FinancialDashboard - Feature 1
// admin can view real financial report data fetched from the backend
function FinancialDashboard({ onNavigate, onLogout }) {
  // real data states - these get filled from the backend API
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topParts, setTopParts] = useState([]);
  const [loading, setLoading] = useState(true);

  // true if connected to backend, false if not
  const [isConnected, setIsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchText, setSearchText] = useState('');

  // ref for the chart canvas
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const userName = localStorage.getItem('userName') || 'Admin User';

  // get two letter initials from the username
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  // fetch all data from the backend when page loads
  useEffect(() => {
    fetchReportData();
  }, []);

  // draw chart when monthly data is available
  useEffect(() => {
    if (monthlyData.length > 0) {
      drawRevenueChart();
    }
    // cleanup chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyData]);

  // call the backend API to get the financial report
  const fetchReportData = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // get full financial report from backend
      const { ok, data } = await getFinancialReport();

      if (ok && data) {
        // set summary numbers from real backend data
        setSummary(data.summary);
        setMonthlyData(data.monthlyRevenue || []);
        setTopParts(data.topParts || []);
        setIsConnected(true);
      } else {
        // backend returned an error response
        setIsConnected(false);
        setErrorMsg('Backend returned an error. Please check if you are logged in as Admin.');
        // load demo data so the UI is not empty
        loadDemoData();
      }
    } catch (err) {
      // network error - backend is probably not running
      setIsConnected(false);
      setErrorMsg('Cannot connect to backend. Start the backend server at localhost:5213.');
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  // load demo data so the UI still looks good when backend is offline
  const loadDemoData = () => {
    setSummary({
      totalRevenue: 1248392,
      totalInvoices: 342,
      paidInvoices: 289,
      unpaidInvoices: 53,
      totalCustomers: 127,
      averageInvoiceValue: 3650.27,
    });
    setMonthlyData([
      { monthName: 'January', revenue: 85000, invoiceCount: 42 },
      { monthName: 'February', revenue: 92000, invoiceCount: 48 },
      { monthName: 'March', revenue: 78000, invoiceCount: 39 },
      { monthName: 'April', revenue: 110000, invoiceCount: 55 },
      { monthName: 'May', revenue: 125000, invoiceCount: 62 },
      { monthName: 'June', revenue: 84200, invoiceCount: 43 },
    ]);
    setTopParts([]);
  };

  // draw the revenue vs sales chart using chart.js
  const drawRevenueChart = () => {
    // destroy old chart first to avoid duplicate charts
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // get labels and values from monthly data
    const labels = monthlyData.map(m => m.monthName.slice(0, 3).toUpperCase());
    const revenueValues = monthlyData.map(m => m.revenue);

    // estimate sales volume as 60% of revenue
    const salesVolume = revenueValues.map(v => parseFloat((v * 0.6).toFixed(2)));

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Gross Revenue',
            data: revenueValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Sales Volume',
            data: salesVolume,
            borderColor: '#94a3b8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 3,
            pointBackgroundColor: '#94a3b8',
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `£${Number(ctx.parsed.y).toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#94a3b8' },
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 11 },
              color: '#94a3b8',
              callback: (val) => `£${(val / 1000).toFixed(0)}k`,
            },
          },
        },
      },
    });
  };

  // format number as currency
  const formatCurrency = (num) =>
    `$${Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  // demo transactions data for the table (no separate backend endpoint yet)
  const demoTransactions = [
    { id: '#TR-89021', entity: 'Precision Brake Supply', amount: 12450, status: 'Completed', date: 'Oct 24, 2023' },
    { id: '#TR-89022', entity: 'Downtown Service Center', amount: 4120.30, status: 'Pending', date: 'Oct 24, 2023' },
    { id: '#TR-89023', entity: 'Global Logistics Corp', amount: 1800, status: 'Review', date: 'Oct 23, 2023' },
    { id: '#TR-89024', entity: 'Quick-Stop Auto Parts', amount: 22940, status: 'Completed', date: 'Oct 23, 2023' },
  ];

  // demo critical stock
  const criticalStock = [
    { name: 'Ceramic Brake Pads (X4)', qty: 4, note: 'Last restocked 14 days ago' },
    { name: 'V8 Cylinder Head Gasket', qty: 2, note: 'High turnover item' },
    { name: 'High-Flow Fuel Injector', qty: 3, note: '3 units sold today' },
    { name: 'Synthetic Oil 5W-30 (1L)', qty: 9, note: 'Reorder point reached' },
  ];

  // get the right css class for status badges
  const getBadgeClass = (status) => {
    if (status === 'Completed') return 'badge badge-completed';
    if (status === 'Pending') return 'badge badge-pending';
    return 'badge badge-review';
  };

  return (
    <div className="dashboard-layout">
      {/* sidebar navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">AP</div>
          <div className="logo-text">
            <h2>AutoPart Pro</h2>
            <p>WAREHOUSE MANAGEMENT</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">⊞</span> Dashboard
          </div>
          <div className="nav-item" onClick={() => onNavigate('inventory')} style={{ cursor: 'pointer' }}>
            <span className="nav-icon">📦</span> Inventory
          </div>
          <div className="nav-item">
            <span className="nav-icon">💰</span> Sales
          </div>
          <div className="nav-item">
            <span className="nav-icon">📊</span> Reports
          </div>
          <div className="nav-item" onClick={() => onNavigate('staff')} style={{ cursor: 'pointer' }}>
            <span className="nav-icon">👥</span> Staff
          </div>
          <div className="nav-item">
            <span className="nav-icon">🧑‍💼</span> Customers
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item">
            <span className="nav-icon">⚙</span> Settings
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="nav-icon">↩</span> Logout
          </button>
        </div>
      </aside>

      {/* main content area */}
      <div className="main-area">
        {/* top bar */}
        <header className="topbar">
          <div className="search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search transactions, parts, or reports..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="topbar-right">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">❓</button>
            <div className="user-info">
              <div className="user-details">
                <div className="user-name">{userName}</div>
                <div className="user-role">Head of Finance</div>
              </div>
              <div className="user-avatar">{getInitials(userName)}</div>
            </div>
          </div>
        </header>

        <div className="dashboard-body">
          <h1 className="page-title">Financial Dashboard</h1>

          {/* show connection status banner */}
          {!loading && (
            <div className={`connection-banner ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected
                ? '✅ Live data — connected to backend database'
                : `⚠ Demo data — ${errorMsg}`}
            </div>
          )}

          {loading && (
            <div className="loading-bar">Loading financial data from backend...</div>
          )}

          {/* 3 stat cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div>
                <span className="stat-label">Total Revenue (YTD)</span>
                <div className="stat-value">
                  {loading ? '...' : formatCurrency(summary?.totalRevenue)}
                </div>
                <div className="stat-change positive">
                  ↗ {summary?.paidInvoices || 0} paid invoices
                </div>
              </div>
              <div className="stat-icon">📈</div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Monthly Sales</span>
                <div className="stat-value">
                  {loading ? '...' : formatCurrency(monthlyData[monthlyData.length - 1]?.revenue || 0)}
                </div>
                <div className="stat-change positive">
                  ↗ {monthlyData[monthlyData.length - 1]?.invoiceCount || 0} invoices this month
                </div>
              </div>
              <div className="stat-icon">🛒</div>
            </div>

            <div className="stat-card">
              <div>
                <span className="stat-label">Total Invoices</span>
                <div className="stat-value">
                  {loading ? '...' : summary?.totalInvoices || 0}
                </div>
                <div className="stat-change warning">
                  ⚠ {summary?.unpaidInvoices || 0} unpaid invoices
                </div>
              </div>
              <div className="stat-icon">🧾</div>
            </div>
          </div>

          {/* chart and revenue breakdown */}
          <div className="middle-row">
            <div className="chart-card">
              <div className="card-header">
                <div>
                  <div className="card-title">Revenue vs. Sales Trends</div>
                  <div className="card-subtitle">Comparative analysis of monthly performance</div>
                </div>
                <button className="period-btn">Last 6 Months</button>
              </div>
              <div className="chart-wrapper">
                <canvas ref={chartRef}></canvas>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#3b82f6' }}></div>
                  Gross Revenue
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ background: '#94a3b8' }}></div>
                  Sales Volume
                </div>
              </div>
            </div>

            <div className="breakdown-card">
              <div className="card-header">
                <div className="card-title">Revenue Breakdown</div>
              </div>

              {/* if we have real top parts data show it, else show defaults */}
              {topParts.length > 0 ? (
                topParts.slice(0, 3).map((part, i) => {
                  const total = topParts.reduce((s, p) => s + p.totalRevenue, 0);
                  const pct = total > 0 ? Math.round((part.totalRevenue / total) * 100) : 0;
                  const colors = ['#3b82f6', '#60a5fa', '#93c5fd'];
                  return (
                    <div className="breakdown-item" key={i}>
                      <div className="breakdown-row">
                        <span className="breakdown-label">{part.partName}</span>
                        <span className="breakdown-pct">{pct}%</span>
                      </div>
                      <div className="breakdown-bar-bg">
                        <div className="breakdown-bar-fill" style={{ width: `${pct}%`, background: colors[i] }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {[{ label: 'Replacement Parts', pct: 58, color: '#3b82f6' }, { label: 'Workshop Service', pct: 24, color: '#60a5fa' }, { label: 'Accessory Sales', pct: 18, color: '#93c5fd' }].map((item, i) => (
                    <div className="breakdown-item" key={i}>
                      <div className="breakdown-row">
                        <span className="breakdown-label">{item.label}</span>
                        <span className="breakdown-pct">{item.pct}%</span>
                      </div>
                      <div className="breakdown-bar-bg">
                        <div className="breakdown-bar-fill" style={{ width: `${item.pct}%`, background: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="breakdown-note">
                "Replacement Parts continue to drive the majority of revenue, showing an 8% uptick since the previous quarter."
              </div>
            </div>
          </div>

          {/* bottom row - transactions and critical stock */}
          <div className="bottom-row">
            <div className="transactions-card">
              <div className="card-header">
                <div className="card-title">Recent Financial Transactions</div>
                <span className="view-all-link">View All</span>
              </div>
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>TRANSACTION ID</th>
                    <th>ENTITY</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {demoTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td className="tx-id">{tx.id}</td>
                      <td>{tx.entity}</td>
                      <td style={{ fontWeight: 600 }}>${tx.amount.toLocaleString()}</td>
                      <td><span className={getBadgeClass(tx.status)}>{tx.status}</span></td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stock-card">
              <div className="critical-header">
                <span>⚠</span>
                <span className="critical-title">CRITICAL STOCK</span>
              </div>
              {criticalStock.map((item, i) => (
                <div key={i} className="stock-item">
                  <div>
                    <div className="stock-item-name">{item.name}</div>
                    <div className="stock-item-note">{item.note}</div>
                  </div>
                  <div className="stock-qty">{item.qty} Left</div>
                </div>
              ))}
              <button className="bulk-btn">Generate Bulk Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialDashboard;
