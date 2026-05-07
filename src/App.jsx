import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StaffSearch from './pages/StaffSearch';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<StaffSearch />} />
        <Route path="/staff-search" element={<StaffSearch />} />
      </Routes>
    </Layout>
  );
}

export default App;