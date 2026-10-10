import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import API from '../services/api';

const ProductModal = ({ product, isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Smartphones',
    brand: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    minStockLimit: '5',
    unit: 'pieces',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'Smartphones',
        brand: product.brand || '',
        costPrice: product.costPrice || '',
        sellingPrice: product.sellingPrice || '',
        quantity: product.quantity ?? '',
        minStockLimit: product.minStockLimit ?? '5',
        unit: product.unit || 'pieces',
        description: product.description || ''
      });
    } else {
      setFormData({
        name: '',
        sku: 'PRD-' + Math.floor(1000 + Math.random() * 9000),
        category: 'Smartphones',
        brand: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '10',
        minStockLimit: '5',
        unit: 'pieces',
        description: ''
      });
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (product) {
        // Update product
        await API.put(`/products/${product._id}`, formData);
      } else {
        // Create new product
        await API.post('/products', formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">
            {product ? 'Edit Product Details' : 'Add New Inventory Item'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung Galaxy S24"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">SKU / Code *</label>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. SAM-S24"
                className="w-full px-3 py-2 text-sm uppercase border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="Smartphones">Smartphones</option>
                <option value="Audio">Audio</option>
                <option value="Accessories">Accessories</option>
                <option value="Storage">Storage</option>
                <option value="Wearables">Wearables</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Brand / Company</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Samsung, Apple, boAt"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Type</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g. pieces, phones, box"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cost Price (₹) *</label>
              <input
                type="number"
                name="costPrice"
                required
                min="0"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="Buying price"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                name="sellingPrice"
                required
                min="0"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Retail price"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Available Quantity *</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Current stock"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1">
                ⚠️ Low Stock Alert Limit *
              </label>
              <input
                type="number"
                name="minStockLimit"
                required
                min="1"
                value={formData.minStockLimit}
                onChange={handleChange}
                placeholder="Alert threshold (e.g. 5)"
                className="w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50/40 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Triggers warning when stock falls to this number</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Notes</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Color, warranty or specs..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : product ? 'Update Product' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
