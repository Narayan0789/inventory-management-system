import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Download,
  Filter,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import API from '../services/api';
import ProductModal from '../components/ProductModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Products = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const res = await API.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/products/meta/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedStatus]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}" (${product.sku})?`)) {
      return;
    }

    try {
      await API.delete(`/products/${product._id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  // CSV Export Function (College Presentation Feature)
  const exportToCSV = () => {
    if (products.length === 0) return;

    const headers = ['Product Name', 'SKU', 'Category', 'Brand', 'Cost Price', 'Selling Price', 'Quantity', 'Min Alert Limit', 'Status'];
    const rows = products.map((p) => [
      `"${p.name}"`,
      p.sku,
      p.category,
      p.brand,
      p.costPrice,
      p.sellingPrice,
      p.quantity,
      p.minStockLimit,
      p.stockStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, edit products and track live stock quantities
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or brand..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5" /> Category:
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Stock Status Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedStatus === 'all' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('in-stock')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedStatus === 'in-stock' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setSelectedStatus('low-stock')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedStatus === 'low-stock' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setSelectedStatus('out-of-stock')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedStatus === 'out-of-stock' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No products match the selected criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold bg-slate-50">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Category</th>
                  {isAdmin && <th className="py-3 px-4 text-right">Cost (₹)</th>}
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-center">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const isOutOfStock = p.quantity === 0;
                  const isLowStock = !isOutOfStock && p.quantity <= p.minStockLimit;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.brand} {p.description ? `• ${p.description}` : ''}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700 uppercase">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {p.category}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right text-slate-500 font-mono">
                          ₹{p.costPrice?.toLocaleString()}
                        </td>
                      )}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                        ₹{p.sellingPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="font-bold text-sm text-slate-800">
                          {p.quantity} <span className="text-[10px] font-normal text-slate-500">{p.unit}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Min limit: {p.minStockLimit}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Restock Link */}
                          <Link
                            to={`/stock-in?productId=${p._id}`}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                            title="Add Stock (Stock In)"
                          >
                            <Truck className="w-4 h-4" />
                          </Link>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                                title="Edit Product"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(p)}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchProducts}
      />
    </div>
  );
};

export default Products;
