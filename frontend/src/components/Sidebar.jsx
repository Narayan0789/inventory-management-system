import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  ShoppingCart,
  Truck,
  ReceiptText,
  Users,
  ShieldCheck,
  Box,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ alertCount = 0, isMobileOpen = false, onCloseMobile }) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Inventory / Products', icon: Package },
    {
      to: '/alerts',
      label: 'Stock Alerts',
      icon: AlertTriangle,
      badge: alertCount > 0 ? alertCount : null
    },
    { to: '/sales', label: 'Point of Sale (Billing)', icon: ShoppingCart },
    { to: '/stock-in', label: 'Stock-In (Purchase)', icon: Truck },
    { to: '/transactions', label: 'History & Invoices', icon: ReceiptText },
    ...(isAdmin ? [{ to: '/users', label: 'Manage Staff', icon: Users }] : [])
  ];

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Logo & Mobile Close */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-lg leading-none">StockPilot</h1>
            <p className="text-[11px] text-slate-400 font-medium">Inventory Management</p>
          </div>
        </div>
        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Role Card */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white bg-emerald-600">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-300 bg-slate-700/50 px-1.5 py-0.5 rounded">
                Staff
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 text-center shrink-0">
        StockPilot Enterprise • Cloud Edition
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (permanently fixed on left, never scrolls out of view) */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 border-r border-slate-800 bg-slate-900 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer (Slide in from left) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
