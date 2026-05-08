import React, { useState } from "react";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import StaffDirectory from "./features/staff/StaffDirectory";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const navigate = (page) => setCurrentPage(page);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setCurrentPage("login");
  };
  if (currentPage === "login") return <Login onNavigate={navigate} />;
  if (currentPage === "signup") return <Register onNavigate={navigate} />;
  if (currentPage === "dashboard" || currentPage === "staff") return <StaffDirectory onNavigate={navigate} onLogout={handleLogout} />;
  return <Login onNavigate={navigate} />;
}
export default App;
