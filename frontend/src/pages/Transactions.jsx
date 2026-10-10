import React, { useState, useEffect } from 'react';
import { ReceiptText, Search, Download, Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import API from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (search) params.search = search;

      const res = await API.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [typeFilter, search]);

  const exportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Ref Number', 'Type', 'Party Name', 'Contact', 'Total Amount', 'Payment Method', 'Handled By', 'Date'];
    const rows = transactions.map((t) => [
      t.referenceNumber,
      t.transactionType,
      `"${t.partyName}"`,
      t.partyContact || '',
      t.totalAmount,
      t.paymentMethod,
      `"${t.handledBy?.name || 'Staff'}"`,
      new Date(t.createdAt).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Transaction History & Invoices</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail of sales receipts, supplier purchase orders and billing logs
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
        >
          <Download className="w-3.5 h-3.5" /> Export Report (CSV)
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, customer..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs w-full sm:w-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              typeFilter === 'all' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Movements
          </button>
          <button
            onClick={() => setTypeFilter('stock-out')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              typeFilter === 'stock-out' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sales (Out)
          </button>
          <button
            onClick={() => setTypeFilter('stock-in')}
            className={`px-3 py-1 rounded-md font-medium transition ${
              typeFilter === 'stock-in' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Purchases (In)
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No transactions recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold bg-slate-50">
                  <th className="py-3 px-4">Invoice / Ref #</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Party Name</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Processed By</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Bill Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isSale = tx.transactionType === 'stock-out';
                  return (
                    <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {tx.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          isSale
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {isSale ? (
                            <>
                              <ArrowUpRight className="w-3 h-3" /> Sale Out
                            </>
                          ) : (
                            <>
                              <ArrowDownLeft className="w-3 h-3" /> Stock In
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {tx.partyName}
                        {tx.partyContact && (
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.partyContact}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {tx.items?.length || 0} product(s)
                      </td>
                      <td className="py-3 px-4 text-right font-black text-slate-900 font-mono text-sm">
                        ₹{tx.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {tx.handledBy?.name || 'Staff'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Bill
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedTx && (
        <InvoiceModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
};

export default Transactions;
