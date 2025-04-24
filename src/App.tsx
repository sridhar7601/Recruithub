import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import DrivesPage from "./pages/drives/DrivesPage";
import Login from "./pages/auth/Login";
import StudentDataPage from "./pages/students/StudentDataPage";
import StudentProfilePage from "./pages/students/StudentProfilePage";
import DriveOverviewPage from "./pages/students/DriveOverviewPage";
import RoundsPage from "./pages/rounds/RoundsPage";
import CollegesPage from "./pages/colleges/CollegesPage";
import PreScreeningComponent from "./components/screening/PreScreeningComponent";

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
            <StudentDataPage />
          </ProtectedRoute>
        } />

<Route path="/drives/:driveId/prescreening" element={
  <ProtectedRoute>
    <PreScreeningComponent />
  </ProtectedRoute>
} />
        <Route path="/drives/:driveId/overview" element={
          <ProtectedRoute>
            <DriveOverviewPage />
          </ProtectedRoute>
        } />

        <Route path="/drives/:driveId/prescreening" element={
          <ProtectedRoute>
            <StudentDataPage />
          </ProtectedRoute>
        } />
        
        <Route path="/drives/:driveId/round-1" element={
          <ProtectedRoute>
            <StudentDataPage />
          </ProtectedRoute>
        } />
        <Route path="/drives/:driveId/rounds" element={
          <ProtectedRoute>
            <RoundsPage />
          </ProtectedRoute>
        } />
         <Route path="/colleges" element={
          <ProtectedRoute>
            <CollegesPage />
          </ProtectedRoute>
        } />
        <Route path="/drives/:driveId/settings" element={
          <ProtectedRoute>
            <StudentDataPage />
          </ProtectedRoute>
        } />
        <Route path="/students/:studentId" element={
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        } />
        {/* Additional routes will be added in future batches */}
      </Routes>
    </Router>
  );
}

export default App;
