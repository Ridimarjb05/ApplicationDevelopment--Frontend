import React, { useState } from "react";
import { registerUser } from "./authAPI";
import "./Register.css";

function Register({ onNavigate }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms of Service."); return; }
    setError(""); setLoading(true);
    try {
      const { ok, data } = await registerUser(form);
      if (!ok) { setError(data.message || "Registration failed. Try again."); }
      else { onNavigate("login"); }
    } catch { setError("Network error. Is your backend running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="register-container">
      <nav className="register-navbar">
        <div className="nav-left">
          <span className="logo">AutoPart Pro</span>
          <a href="#">Support</a>
          <a href="#">Documentation</a>
        </div>
        <div className="nav-right">
          <span className="system-status">System Status</span>
        </div>
      </nav>

      <div className="register-content">
        <div className="register-left">
          <div className="form-container">
            <h2>Create an Account</h2>
            <p className="subtitle">Access your dashboard and start managing inventory.</p>
            {error && <div className="error-box">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input name="fullName" type="text" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <span className="input-icon">✉</span>
                <input name="email" type="email" placeholder="name@company.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <span className="input-icon">📞</span>
                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} />
              </div>
              <div className="input-group password-group">
                <span className="input-icon">🔒</span>
                <input name="password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
                <button type="button" className="toggle-password" onClick={() => setShowPass(!showPass)}>{showPass ? "Hide" : "👁"}</button>
              </div>
              <label className="terms-label">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</span>
              </label>
              <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
            </form>
            <p className="have-account">Already have an account? <strong style={{ cursor: "pointer", color: "#3b82f6" }} onClick={() => onNavigate("login")}>Log in</strong></p>
          </div>
        </div>

        <div className="register-right">
          <div className="right-overlay">
            <h1>Advanced Inventory Systems for Industrial Scale.</h1>
            <p>Join the network of professional warehouse managers and retail operators streamlining their automotive logistics with AutoPart Pro.</p>
            <ul className="feature-list">
              <li><span className="check">✓</span> Real-time Stock Management</li>
              <li><span className="check">✓</span> Automated Low-Stock Alerts</li>
              <li><span className="check">✓</span> Precision Analytics Dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="register-footer">
        <p>© 2026 AutoPart Management Systems. Industrial Efficiency Guaranteed.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}

export default Register;
