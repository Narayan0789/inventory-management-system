import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Receipt,
  User,
  CreditCard
} from 'lucide-react';
import API from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

const SalesBilling = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedTx, setCompletedTx] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products for POS', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setError('');
    if (product.quantity <= 0) {
      setError(`"${product.name}" is completely out of stock.`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.product._id === product._id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= product.quantity) {
        setError(`Cannot add more. Only ${product.quantity} units available in stock.`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1, unitPrice: product.sellingPrice }]);
    }
  };

  const updateQuantity = (index, newQty) => {
    setError('');
    const item = cart[index];
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    if (newQty > item.product.quantity) {
      setError(`Cannot exceed available stock of ${item.product.quantity} for "${item.product.name}".`);
      return;
    }
    const updated = [...cart];
    updated[index].quantity = newQty;
    setCart(updated);
  };

  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your billing cart is empty. Add products first.');
      return;
    }

    if (!customerName.trim()) {
      setError('Please enter customer name.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName,
        customerContact,
        paymentMethod,
        notes,
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      const res = await API.post('/transactions/stock-out', payload);
      if (res.data.success) {
        setCompletedTx(res.data.data);
        // Clear cart
        setCart([]);
        setCustomerName('');
        setCustomerContact('');
        setNotes('');
        // Refresh products stock in catalog
        fetchProducts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed. Check stock availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Point of Sale (Sales Billing)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create customer invoices with real-time stock deduction and instant bill receipt printing
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
          <ShoppingCart className="w-4 h-4 text-emerald-600" /> Cart Items: {cart.length}
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Layout: Product Catalog (Left) + Cart & Checkout (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Selector (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-800">Select Products</h3>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or SKU..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const isOut = p.quantity <= 0;
              const isLow = !isOut && p.quantity <= p.minStockLimit;

              return (
                <div
                  key={p._id}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition ${
                    isOut
                      ? 'bg-slate-50/70 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{p.name}</h4>
                      <span className="text-[10px] font-mono font-medium text-slate-400 uppercase shrink-0">
                        {p.sku}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.category}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-black text-slate-900 text-sm">₹{p.sellingPrice?.toLocaleString()}</span>
                      <span className={`block text-[10px] font-bold ${
                        isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {isOut ? 'Out of Stock' : `${p.quantity} in stock`}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      disabled={isOut}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart & Customer Checkout (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-emerald-600" /> Current Billing Cart
            </h3>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl p-2 mb-4">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Cart is empty. Click "+ Add" on items to create sale bill.
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={item.product._id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        ₹{item.unitPrice?.toLocaleString()} × {item.quantity} = <span className="font-bold text-slate-700">₹{(item.quantity * item.unitPrice).toLocaleString()}</span>
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Details Form */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Customer Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI / Online">UPI / Online</option>
                    <option value="Card">Card</option>
                    <option value="Credit / Due">Credit / Due</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sale Notes / Remarks</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional billing note..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Checkout Total & Submit Button */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-500">Total Payable:</span>
              <span className="text-2xl font-black text-slate-900">₹{calculateTotal().toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Processing Sale...' : 'Complete Sale & Print Bill'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal for automatic receipt generation */}
      {completedTx && (
        <InvoiceModal transaction={completedTx} onClose={() => setCompletedTx(null)} />
      )}
    </div>
  );
};

export default SalesBilling;
