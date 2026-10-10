import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockAlerts from './pages/StockAlerts';
import SalesBilling from './pages/SalesBilling';
import StockIn from './pages/StockIn';
import Transactions from './pages/Transactions';
import UsersPage from './pages/Users';
import API from './services/api';

const AppLayout = () => {
  const { token } = useAuth();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchAlertCount = async () => {
    if (!token) return;
    try {
      const res = await API.get('/products/alerts/low-stock');
      if (res.data.success) {
        setAlertCount(res.data.count || 0);
      }
    } catch (e) {
      // ignore silently if not logged in
    }
  };

  useEffect(() => {
    fetchAlertCount();
    setMobileSidebarOpen(false); // Auto close mobile drawer on route change
  }, [location.pathname, token]);

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login defaultRole="staff" />} />
        <Route path="/staff-login" element={<Login defaultRole="staff" />} />
        <Route path="/admin-login" element={<Login defaultRole="admin" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar with desktop fixed layout & mobile drawer */}
      <Sidebar
        alertCount={alertCount}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Navbar with hamburger menu button for mobile */}
        <Navbar
          alertCount={alertCount}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <StockAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <SalesBilling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock-in"
              element={
                <ProtectedRoute>
                  <StockIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
