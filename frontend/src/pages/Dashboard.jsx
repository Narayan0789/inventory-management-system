import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Boxes,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Truck,
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import StatCard from '../components/StatCard';
import InvoiceModal from '../components/InvoiceModal';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await API.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Fetching real-time inventory metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xs border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            {isAdmin ? 'Administrator Portal' : 'Staff Billing Terminal'}
          </span>
          <h1 className="text-2xl font-black mt-1">Welcome back, {user?.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time tracking of stock movements, reorder limits, and daily counter sales.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            to="/sales"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
          >
            <ShoppingCart className="w-4 h-4" /> Quick POS Sale
          </Link>
          <Link
            to="/stock-in"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition"
          >
            <Truck className="w-4 h-4" /> Stock-In Entry
          </Link>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {stats?.criticalAlertsTotal > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Low Stock Warning: {stats.criticalAlertsTotal} item(s) need replenishment!
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {stats.outOfStockCount > 0 && `${stats.outOfStockCount} out of stock • `}
                {stats.lowStockCount} items below configured minimum reorder limit.
              </p>
            </div>
          </div>
          <Link
            to="/alerts"
            className="px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition shrink-0 flex items-center gap-1"
          >
            Review Alerts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          subtext="Active SKU codes"
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Stock Units"
          value={stats?.totalStockUnits?.toLocaleString() || 0}
          subtext="Total items in warehouse"
          icon={Boxes}
          color="slate"
        />
        <StatCard
          title="Today's Sales"
          value={`₹${(stats?.todaySales || 0).toLocaleString()}`}
          subtext={`${stats?.todayOrdersCount || 0} orders processed today`}
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats?.criticalAlertsTotal || 0}
          subtext={`${stats?.outOfStockCount || 0} completely empty`}
          icon={AlertTriangle}
          color={stats?.criticalAlertsTotal > 0 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Admin Specific Inventory Valuation Row */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Inventory Valuation</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{(stats?.totalInventoryValue || 0).toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculated at current product purchase cost price</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Lifetime Sales Revenue</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                ₹{(stats?.lifetimeSales || 0).toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Across {stats?.totalOrders || 0} total sales invoices</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Two Column Section: Low Stock Quick List & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Restock List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Critical Stock Monitor</h3>
              <p className="text-xs text-slate-500">Products requiring purchase orders from suppliers</p>
            </div>
            <Link to="/alerts" className="text-xs font-bold text-emerald-700 hover:underline">
              View All ({stats?.criticalAlertsTotal})
            </Link>
          </div>

          {stats?.criticalStockItems?.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              All inventory levels are healthy! No items below minimum threshold.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats?.criticalStockItems?.map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500">
                      SKU: <span className="font-mono">{item.sku}</span> • Category: {item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                        item.quantity === 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.quantity === 0 ? 'Out of Stock (0)' : `Only ${item.quantity} ${item.unit}`}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Min limit: {item.minStockLimit}</p>
                    </div>
                    <Link
                      to={`/stock-in?productId=${item._id}`}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Category Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Stock density across product lines</p>

          <div className="space-y-3.5">
            {stats?.categoryStats?.map((cat) => {
              const percentage = Math.round(((cat.stock || 0) / (stats.totalStockUnits || 1)) * 100);
              return (
                <div key={cat._id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat._id}</span>
                    <span className="text-slate-500">{cat.stock} units ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Stock Movements</h3>
            <p className="text-xs text-slate-500">Latest sales billing and supplier purchases</p>
          </div>
          <Link to="/transactions" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Transactions
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold bg-slate-50/50">
                <th className="py-2.5 px-3">Reference / Bill #</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Customer / Supplier</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Handled By</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentTransactions?.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{tx.referenceNumber}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.transactionType === 'stock-out'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {tx.transactionType === 'stock-out' ? 'Sale (Out)' : 'Purchase (In)'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{tx.partyName}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ₹{tx.totalAmount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{tx.handledBy?.name || 'Staff'}</td>
                  <td className="py-3 px-3 text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded transition"
                      title="View Bill"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal for reprinting bill */}
      {selectedTx && (
        <InvoiceModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
};

export default Dashboard;
