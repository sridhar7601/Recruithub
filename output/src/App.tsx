import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import DrivesPage from './pages/drives/DrivesPage';
import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/drives" element={<DrivesPage />} />
        {/* Additional routes will be added in future batches */}
      </Routes>
    </Router>
  );
}

export default App;