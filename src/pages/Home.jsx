import { Link } from "react-router-dom";
import "../styles/layout.css";

export default function Home() {
    return (
        <div className="container">
            <div className="hero">
                <h1>Vehicle Parts System</h1>
                <p>
                    Manage customer registration, staff customer search, and invoice emailing.
                </p>

                <div className="grid">
                    <Link className="tile" to="/register">
                        <div className="tile__title">Feature 12</div>
                        <div className="tile__desc">Customer self-register</div>
                    </Link>

                    <Link className="tile" to="/profile">
                        <div className="tile__title">Feature 12</div>
                        <div className="tile__desc">Manage profile & vehicles</div>
                    </Link>

                    <Link className="tile" to="/staff-search">
                        <div className="tile__title">Feature 10</div>
                        <div className="tile__desc">Staff search customers</div>
                    </Link>

                    <Link className="tile" to="/send-invoice">
                        <div className="tile__title">Feature 11</div>
                        <div className="tile__desc">Send invoice via email</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}