import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0F172A] p-6 font-sans">
        
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
