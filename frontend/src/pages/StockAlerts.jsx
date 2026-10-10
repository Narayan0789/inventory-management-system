import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  XCircle,
  Truck,
  ArrowRight,
  RefreshCw,
  Info,
  ShieldAlert
} from 'lucide-react';
import API from '../services/api';

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products/alerts/low-stock');
      if (res.data.success) {
        setAlerts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load stock alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const outOfStockItems = alerts.filter((a) => a.quantity === 0);
  const lowStockItems = alerts.filter((a) => a.quantity > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Inventory Stock Alerts</h1>
              <p className="text-xs text-slate-500">
                Automated threshold monitoring: Triggers when quantity falls below the minimum safety buffer
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchAlerts}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      </div>

      {/* College Concept Explainer Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-900">How Minimum Stock Alert System Works:</p>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Har product ke paas ek <strong>Minimum Stock Limit (Reorder Point)</strong> hota hai. 
            Jaise hi sales ke baad available quantity is limit se kam ya barabar ho jaati hai, 
            system automated notification trigger karta hai taaki customer demand aane se pehle naya stock supplier se mangwaya ja sake.
          </p>
        </div>
      </div>

      {/* Quick Summary Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-red-600">Zero Stock / Out of Stock</span>
            <h3 className="text-2xl font-black text-red-800 mt-0.5">{outOfStockItems.length} Products</h3>
            <p className="text-xs text-red-600 mt-1">Cannot be billed to customers right now</p>
          </div>
          <div className="p-3 bg-red-100 text-red-700 rounded-xl">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-700">Low Stock Warning</span>
            <h3 className="text-2xl font-black text-amber-900 mt-0.5">{lowStockItems.length} Products</h3>
            <p className="text-xs text-amber-700 mt-1">Stock is below minimum threshold limit</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Out of Stock Section */}
      {outOfStockItems.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-red-500/10 border-b border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-red-900">Immediate Action Required — Out of Stock (0 Units)</h3>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
              {outOfStockItems.length} items
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {outOfStockItems.map((item) => (
              <div key={item._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    SKU: <span className="font-mono font-medium">{item.sku}</span> • Category: {item.category} • Cost: ₹{item.costPrice?.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600 font-medium mt-1">
                    Configured Minimum Reorder Threshold: {item.minStockLimit} {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-300">
                    0 {item.unit} left
                  </span>
                  <Link
                    to={`/stock-in?productId=${item._id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                  >
                    <Truck className="w-3.5 h-3.5" /> Record Stock-In
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Items Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-amber-500/10 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-900">Low Stock Items — Approaching Zero</h3>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            {lowStockItems.length} items
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Scanning inventory thresholds...</div>
        ) : lowStockItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No products currently in low-stock status. Good job!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {lowStockItems.map((item) => {
              const ratio = Math.round((item.quantity / item.minStockLimit) * 100);
              return (
                <div key={item._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Low Stock
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SKU: <span className="font-mono">{item.sku}</span> • {item.category} • Selling Price: ₹{item.sellingPrice?.toLocaleString()}
                    </p>

                    {/* Stock level bar */}
                    <div className="mt-2.5 max-w-xs space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>Current: {item.quantity} {item.unit}</span>
                        <span>Safety Limit: {item.minStockLimit} {item.unit}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(ratio, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-amber-900 block">
                        {item.quantity} {item.unit}
                      </span>
                      <span className="text-[10px] text-slate-400">Needs replenishment</span>
                    </div>
                    <Link
                      to={`/stock-in?productId=${item._id}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                    >
                      <Truck className="w-3.5 h-3.5" /> Record Stock-In
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlerts;
