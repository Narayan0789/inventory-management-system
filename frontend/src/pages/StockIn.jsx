import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Truck, Plus, Trash2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

const StockIn = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('productId');
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(preselectedId || '');
  const [quantity, setQuantity] = useState('10');
  const [unitCost, setUnitCost] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Online');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successTx, setSuccessTx] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        if (res.data.success) {
          setProducts(res.data.data);
          if (preselectedId) {
            const found = res.data.data.find((p) => p._id === preselectedId);
            if (found) {
              setSelectedProductId(found._id);
              setUnitCost(found.costPrice);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load products', err);
      }
    };
    fetchProducts();
  }, [preselectedId]);

  const handleProductChange = (e) => {
    const pId = e.target.value;
    setSelectedProductId(pId);
    const found = products.find((p) => p._id === pId);
    if (found) {
      setUnitCost(found.costPrice);
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedProductId) {
      setError('Please select a product to restock');
      return;
    }

    if (!supplierName.trim()) {
      setError('Please enter supplier name');
      return;
    }

    const qtyNum = Number(quantity);
    if (qtyNum <= 0) {
      setError('Quantity must be at least 1 unit');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        supplierName,
        supplierContact,
        paymentMethod,
        notes,
        items: [
          {
            productId: selectedProductId,
            quantity: qtyNum,
            unitPrice: Number(unitCost)
          }
        ]
      };

      const res = await API.post('/transactions/stock-in', payload);
      if (res.data.success) {
        setSuccessTx(res.data.data);
        // Reset form
        setQuantity('10');
        setSupplierName('');
        setSupplierContact('');
        setNotes('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record Stock-In entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Stock-In Entry (Purchase)</h1>
            <p className="text-xs text-slate-500">
              Receive fresh stock inventory from distributors and vendors
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stock In Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Product to Restock *
            </label>
            <select
              value={selectedProductId}
              onChange={handleProductChange}
              required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="">-- Choose from available products --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.sku}) — Current Stock: {p.quantity} {p.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock vs New Stock Preview */}
          {selectedProduct && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Stock</span>
                <p className="text-lg font-bold text-slate-700 mt-0.5">
                  {selectedProduct.quantity} {selectedProduct.unit}
                </p>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] uppercase font-bold text-blue-600">+ Adding Units</span>
                <p className="text-lg font-bold text-blue-600 mt-0.5">
                  +{Number(quantity) || 0} {selectedProduct.unit}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600">New Total Stock</span>
                <p className="text-lg font-black text-emerald-600 mt-0.5">
                  {selectedProduct.quantity + (Number(quantity) || 0)} {selectedProduct.unit}
                </p>
              </div>
            </div>
          )}

          {/* Quantity & Buying Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantity Received (Units) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit Purchase Cost Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="Rate per unit"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Supplier Details */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Supplier & Invoice Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Supplier / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. TechSupply Wholesale Delhi"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Supplier Phone / GST
                </label>
                <input
                  type="text"
                  value={supplierContact}
                  onChange={(e) => setSupplierContact(e.target.value)}
                  placeholder="e.g. 9811223344"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                >
                  <option value="UPI / Online">UPI / Online</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Credit / Due">Credit / Due</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Remarks / Batch No.</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional note..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Total Purchase Cost:</span>
              <span className="text-xl font-black text-slate-900">
                ₹{((Number(quantity) || 0) * (Number(unitCost) || 0)).toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Updating Stock...' : 'Save Stock-In & Update Inventory'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Purchase Receipt Modal */}
      {successTx && (
        <InvoiceModal transaction={successTx} onClose={() => setSuccessTx(null)} />
      )}
    </div>
  );
};

export default StockIn;
