import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import DrivesPage from "./pages/drives/DrivesPage";
import Login from "./pages/auth/Login";
import DriveDetailPage from "./pages/drives/DriveDetailPage";
import CollegesPage from "./pages/colleges/CollegesPage";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authToken = localStorage.getItem("authToken");
  
  if (!authToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/drives" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/drives" element={
          <ProtectedRoute>
            <DrivesPage />
          </ProtectedRoute>
        } />
        <Route path="/drives/:driveId" element={
          <ProtectedRoute>
            <DriveDetailPage />
          </ProtectedRoute>
        } />
         <Route path="/college" element={
          <ProtectedRoute>
            <CollegesPage />
          </ProtectedRoute>
        } />
        {/* Additional routes will be added in future batches */}
      </Routes>
    </Router>
  );
}

export default App;
