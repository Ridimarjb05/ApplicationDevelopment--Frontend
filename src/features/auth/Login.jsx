import React, { useState } from 'react';
import { loginUser } from './authAPI';
import './Login.css';

// Login page - shown when the user is not logged in
function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // call the login API
      const { ok, data } = await loginUser(email, password);

      if (!ok) {
        // show error if login failed
        setError(data.message || 'Invalid email or password');
      } else {
        // save the token and user info in local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.fullName);
        localStorage.setItem('userRole', data.role || 'USER');
        // go to the inventory page
        onNavigate('inventory');
      }
    } catch (err) {
      // this happens if the backend is not running
      setError('Network error. Is your .NET backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      // top navigation bar
      <nav className="login-navbar">
        <div className="nav-left">
          <span className="logo">AutoPart Pro</span>
          <a href="#">Support</a>
          <a href="#">Documentation</a>
        </div>
        <div className="nav-right">
          <span className="system-status">System Status</span>
        </div>
      </nav>

      <div className="login-content">
        // left side - background image with info
        <div className="login-left">
          <div className="left-overlay">
            <h1>Precision Inventory Management.</h1>
            <p>The industrial-grade solution for modern warehouse operations and retail automotive chains.</p>
            <div className="stats-row">
              <div className="stat">
                <h3>99.9%</h3>
                <span>Uptime</span>
              </div>
              <div className="stat">
                <h3>2.4M</h3>
                <span>SKUs Managed</span>
              </div>
            </div>
          </div>
        </div>

        // right side - login form
        <div className="login-right">
          <div className="form-container">
            <h2>Welcome back</h2>
            <p className="subtitle">Access your automotive inventory dashboard</p>

            // show error message if login fails
            {error && (
              <div className="error-box">{error}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                // toggle to show or hide password
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="no-account">
              Don't have an account?{' '}
              <strong style={{ cursor: 'pointer' }} onClick={() => onNavigate('signup')}>
                Sign up
              </strong>
            </p>
          </div>
        </div>
      </div>

      // footer
      <footer className="login-footer">
        <p>© 2026 AutoPart Management Systems.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
