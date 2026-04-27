import { NavLink } from "react-router-dom";
import "../styles/layout.css";

export default function Navbar() {
    return (
        <header className="nav">
            <div className="nav__brand">
                <div className="nav__logo">VP</div>
                <div>
                    <div className="nav__title">Vehicle Parts</div>
                    <div className="nav__subtitle">Inventory & Sales</div>
                </div>
            </div>

            <nav className="nav__links">
                <NavLink to="/" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Home
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Register
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Profile
                </NavLink>
                <NavLink to="/staff-search" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Staff Search
                </NavLink>
                <NavLink to="/send-invoice" className={({ isActive }) => (isActive ? "link active" : "link")}>
                    Send Invoice
                </NavLink>
            </nav>
        </header>
    );
}