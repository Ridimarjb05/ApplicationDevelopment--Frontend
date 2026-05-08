import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { getFinancialReport, getMonthlyRevenue } from './financialAPI';
import './FinancialDashboard.css';

// register all chart.js components so we can use line charts
Chart.register(...registerables);

// FinancialDashboard - Feature 1
// this is the main financial report page that admin can see
// it shows revenue, monthly chart, top parts, transactions and stock alerts
function FinancialDashboard({ onNavigate, onLogout }) {
  // state to hold the financial data from the backend
  const [report, setReport] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  // ref to access the canvas element for the chart
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const userName = localStorage.getItem('userName') || 'Admin User';

  // get initials from the user name for avatar
  const getInitials = (name) => {
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  // load financial data when the page first opens
  useEffect(() => {
    fetchData();
  }, []);

  // draw the chart after monthly data is loaded
  useEffect(() => {
    if (monthlyData.length > 0) {
      drawChart();
    }

    // cleanup: destroy old chart before drawing new one
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyData]);

  // fetch report and monthly revenue from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      // get the full report
      const { ok, data } = await getFinancialReport();

      if (ok) {
        setReport(data);
      } else {
        // if backend fails, use demo data so the UI still shows
        setReport(getDemoReport());
      }

      // get monthly revenue for current year
      const year = new Date().getFullYear();
      const { ok: mOk, data: mData } = await getMonthlyRevenue(year);

      if (mOk && mData.length > 0) {
        setMonthlyData(mData);
      } else {
        // use demo monthly data if backend is not running
        setMonthlyData(getDemoMonthly());
      }
    } catch (err) {
      // if network error, use demo data
      setReport(getDemoReport());
      setMonthlyData(getDemoMonthly());
    } finally {
      setLoading(false);
    }
  };

  // draw the line chart using chart.js
  const drawChart = () => {
    // destroy old chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // get month labels and revenue values from the data
    const labels = monthlyData.map(m => m.monthName.slice(0, 3).toUpperCase());
    const revenueValues = monthlyData.map(m => m.revenue);

    // make fake sales volume data (about 60% of revenue for demo)
    const salesVolume = revenueValues.map(v => v * 0.6);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            // gross revenue line - blue solid
            label: 'Gross Revenue',
            data: revenueValues,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
            fill: true,
            tension: 0.4,
          },
          {
            // sales volume line - light dashed
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
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              // format the tooltip values as currency
              label: (ctx) => `£${ctx.parsed.y.toLocaleString()}`,
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
              // format y axis as currency
              callback: (val) => `£${(val / 1000).toFixed(0)}k`,
            },
          },
        },
      },
    });
  };

  // demo data used when backend is not running
  const getDemoReport = () => ({
    summary: {
      totalRevenue: 1248392,
      totalInvoices: 342,
      paidInvoices: 289,
      unpaidInvoices: 53,
      totalCustomers: 127,
      averageInvoiceValue: 3650.27,
    },
    topParts: [
      { partName: 'Ceramic Brake Pads', totalRevenue: 45200, totalQuantitySold: 320 },
      { partName: 'V8 Cylinder Head Gasket', totalRevenue: 38900, totalQuantitySold: 95 },
    ],
  });

  // demo monthly data for the chart
  const getDemoMonthly = () => [
    { monthName: 'January', revenue: 85000, invoiceCount: 42 },
    { monthName: 'February', revenue: 92000, invoiceCount: 48 },
    { monthName: 'March', revenue: 78000, invoiceCount: 39 },
    { monthName: 'April', revenue: 110000, invoiceCount: 55 },
    { monthName: 'May', revenue: 125000, invoiceCount: 62 },
    { monthName: 'June', revenue: 84200, invoiceCount: 43 },
  ];

  // demo transactions for the table
  const demoTransactions = [
    { id: '#TR-89021', entity: 'Precision Brake Supply', amount: 12450, status: 'Completed', date: 'Oct 24, 2023' },
    { id: '#TR-89022', entity: 'Downtown Service Center', amount: 4120.30, status: 'Pending', date: 'Oct 24, 2023' },
    { id: '#TR-89023', entity: 'Global Logistics Corp', amount: 1800, status: 'Review', date: 'Oct 23, 2023' },
    { id: '#TR-89024', entity: 'Quick-Stop Auto Parts', amount: 22940, status: 'Completed', date: 'Oct 23, 2023' },
  ];

  // demo critical stock items
  const criticalStock = [
    { name: 'Ceramic Brake Pads (X4)', qty: 4, note: 'Last restocked 14 days ago' },
    { name: 'V8 Cylinder Head Gasket', qty: 2, note: 'High turnover item' },
    { name: 'High-Flow Fuel Injector', qty: 3, note: '3 units sold today' },
    { name: 'Synthetic Oil 5W-30 (1L)', qty: 9, note: 'Reorder point reached' },
  ];

  // get the right css class for a status badge
  const getBadgeClass = (status) => {
    if (status === 'Completed') return 'badge badge-completed';
    if (status === 'Pending') return 'badge badge-pending';
    return 'badge badge-review';
  };

  // format a number as currency
  const formatCurrency = (num) => `$${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const summary = report?.summary;

  return (
    <div className="dashboard-layout">
      // sidebar
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">AP</div>
          <div className="logo-text">
            <h2>AutoPart Pro</h2>
            <p>WAREHOUSE MANAGEMENT</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          // dashboard is the active page
          <div className="nav-item active">
            <span className="nav-icon">⊞</span>
            Dashboard
          </div>
          <div className="nav-item" onClick={() => onNavigate && onNavigate('inventory')} style={{ cursor: 'pointer' }}>
            <span className="nav-icon">📦</span>
            Inventory
          </div>
          <div className="nav-item">
            <span className="nav-icon">💰</span>
            Sales
          </div>
          <div className="nav-item active-secondary">
            <span className="nav-icon">📊</span>
            Reports
          </div>
          <div className="nav-item" onClick={() => onNavigate && onNavigate('staff')} style={{ cursor: 'pointer' }}>
            <span className="nav-icon">👥</span>
            Staff
          </div>
          <div className="nav-item">
            <span className="nav-icon">🧑‍💼</span>
            Customers
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item">
            <span className="nav-icon">⚙</span>
            Settings
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="nav-icon">↩</span>
            Logout
          </button>
        </div>
      </aside>

      // main content
      <div className="main-area">
        // top bar with search and user info
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

          // 3 stat cards row
          <div className="stat-cards">
            // total revenue card
            <div className="stat-card">
              <div>
                <span className="stat-label">Total Revenue (YTD)</span>
                <div className="stat-value">
                  {loading ? '...' : formatCurrency(summary?.totalRevenue || 1248392)}
                </div>
                <div className="stat-change positive">↗ 12.5% vs last year</div>
              </div>
              <div className="stat-icon">📈</div>
            </div>

            // monthly sales card
            <div className="stat-card">
              <div>
                <span className="stat-label">Monthly Sales</span>
                <div className="stat-value">
                  {loading ? '...' : formatCurrency(monthlyData[monthlyData.length - 1]?.revenue || 84200)}
                </div>
                <div className="stat-change positive">↗ 4.2% vs last month</div>
              </div>
              <div className="stat-icon">🛒</div>
            </div>

            // inventory value card
            <div className="stat-card">
              <div>
                <span className="stat-label">Inventory Value</span>
                <div className="stat-value">$3,412,000.00</div>
                <div className="stat-change warning">⚠ 32 Low stock alerts</div>
              </div>
              <div className="stat-icon">🏭</div>
            </div>
          </div>

          // middle row - chart and revenue breakdown
          <div className="middle-row">
            // line chart for revenue vs sales
            <div className="chart-card">
              <div className="card-header">
                <div>
                  <div className="card-title">Revenue vs. Sales Trends</div>
                  <div className="card-subtitle">Comparative analysis of monthly performance</div>
                </div>
                <button className="period-btn">Last 6 Months</button>
              </div>

              // chart canvas - chart.js draws here
              <div className="chart-wrapper">
                <canvas ref={chartRef}></canvas>
              </div>

              // chart legend
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

            // revenue breakdown bars
            <div className="breakdown-card">
              <div className="card-header">
                <div className="card-title">Revenue Breakdown</div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-row">
                  <span className="breakdown-label">Replacement Parts</span>
                  <span className="breakdown-pct">58%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: '58%', background: '#3b82f6' }}></div>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-row">
                  <span className="breakdown-label">Workshop Service</span>
                  <span className="breakdown-pct">24%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: '24%', background: '#60a5fa' }}></div>
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-row">
                  <span className="breakdown-label">Accessory Sales</span>
                  <span className="breakdown-pct">18%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: '18%', background: '#93c5fd' }}></div>
                </div>
              </div>

              <div className="breakdown-note">
                "Replacement Parts continue to drive the majority of revenue, showing an 8% uptick since the previous quarter."
              </div>
            </div>
          </div>

          // bottom row - transactions and critical stock
          <div className="bottom-row">
            // recent transactions table
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
                      <td>
                        <span className={getBadgeClass(tx.status)}>{tx.status}</span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            // critical stock alerts
            <div className="stock-card">
              <div className="critical-header">
                <span>⚠</span>
                <span className="critical-title">CRITICAL STOCK</span>
              </div>

              {criticalStock.map((item, index) => (
                <div key={index} className="stock-item">
                  <div>
                    <div className="stock-item-name">{item.name}</div>
                    <div className="stock-item-note">{item.note}</div>
                  </div>
                  <div className="stock-qty">{item.qty} Left</div>
                </div>
              ))}

              // button to generate a bulk order for all critical items
              <button className="bulk-btn">Generate Bulk Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialDashboard;
