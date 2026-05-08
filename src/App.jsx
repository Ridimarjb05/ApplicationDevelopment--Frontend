import React, { useState } from "react";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

// App.jsx - root component for standalone Login/Signup branch
function App() {
  const [currentPage, setCurrentPage] = useState("login");

  const navigate = (page) => {
    setCurrentPage(page);
  };

  if (currentPage === "login") {
    return <Login onNavigate={navigate} />;
  }

  if (currentPage === "signup") {
    return <Register onNavigate={navigate} />;
  }

  // default fallback
  return <Login onNavigate={navigate} />;
}

export default App;
