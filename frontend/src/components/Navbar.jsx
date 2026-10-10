import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, LogOut, ShoppingCart, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ alertCount = 0, onOpenMobileSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Title / Hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger Menu Button (Mobile & Tablet) */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 truncate">
            StockPilot IMS
          </h2>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shrink-0">
            Online
          </span>
        </div>
      </div>

      {/* Right Quick Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Billing Button */}
        <Link
          to="/sales"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Sale</span> (POS)
        </Link>

        {/* Stock Alerts Bell */}
        <Link
          to="/alerts"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          title="Stock Alerts"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-0.5 sm:mx-1"></div>

        {/* User Info */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">{user?.role}</p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Alert Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-7 sm:p-9 max-w-sm w-full mx-auto shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-6 tracking-tight">
              Are you sure you want to logout
            </h3>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-6 sm:px-7 py-1.5 sm:py-2 rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-6 sm:px-7 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition text-sm font-medium shadow-sm cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
