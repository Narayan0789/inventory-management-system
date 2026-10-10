import React from 'react';
import { Printer, X, CheckCircle } from 'lucide-react';

const InvoiceModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSale = transaction.transactionType === 'stock-out';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Action Header (Hidden in Print) */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>{isSale ? 'Customer Tax Invoice' : 'Supplier Purchase Receipt'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print Bill
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 bg-white text-slate-800">
          {/* Shop Header */}
          <div className="border-b border-slate-200 pb-5 mb-5 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black text-slate-900">StockPilot Mobiles & Electronics</h2>
              <p className="text-xs text-slate-500 mt-0.5">Main Road Market, Tech Plaza, Floor 2</p>
              <p className="text-xs text-slate-500">Contact: +91 98765 43210 • GSTIN: 07AAAAA0000A1Z5</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded ${
                isSale ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>
                {isSale ? 'RETAIL INVOICE' : 'PURCHASE ORDER'}
              </span>
              <p className="text-sm font-bold text-slate-900 mt-1.5">{transaction.referenceNumber}</p>
              <p className="text-xs text-slate-500">{new Date(transaction.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Party Details */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <div>
              <p className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">
                {isSale ? 'Customer Details' : 'Supplier Details'}
              </p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{transaction.partyName}</p>
              {transaction.partyContact && (
                <p className="text-slate-600 mt-0.5">Phone: {transaction.partyContact}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-medium uppercase tracking-wider text-[10px]">Payment & Biller</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                Mode: <span className="font-bold text-emerald-700">{transaction.paymentMethod}</span>
              </p>
              <p className="text-slate-600">
                Processed By: {transaction.handledBy?.name || 'Authorized Staff'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs text-left mb-6">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="py-2">Item</th>
                <th className="py-2">SKU</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transaction.items?.map((item, index) => (
                <tr key={index} className="text-slate-700">
                  <td className="py-2.5 font-medium">{item.productName}</td>
                  <td className="py-2.5 text-slate-500 uppercase">{item.sku}</td>
                  <td className="py-2.5 text-right font-semibold">{item.quantity}</td>
                  <td className="py-2.5 text-right">₹{item.unitPrice?.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">₹{item.subtotal?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Summary */}
          <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
            <div className="text-xs text-slate-500">
              {transaction.notes && <p>Note: {transaction.notes}</p>}
              <p className="mt-1 text-[11px] italic">Thank you for your business!</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Grand Total</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{transaction.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Signature Line */}
          <div className="mt-8 pt-6 border-t border-dashed border-slate-200 flex justify-between text-[10px] text-slate-400">
            <p>Computer generated invoice • No signature required</p>
            <p>Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
