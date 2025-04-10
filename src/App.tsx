import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import DrivesPage from './pages/drives/DrivesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/drives" replace />} />
        <Route path="/drives" element={<DrivesPage />} />
        {/* Additional routes will be added in future batches */}
      </Routes>
    </Router>
  );
}

export default App;