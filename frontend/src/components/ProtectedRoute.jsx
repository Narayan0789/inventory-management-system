import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-sm">Loading StockPilot...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 m-8">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied (403)</h2>
        <p className="text-slate-600 mb-4">You do not have Administrator permissions to access this page.</p>
        <p className="text-sm text-slate-500">Your role: <span className="font-semibold uppercase text-indigo-600">{user.role}</span></p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
