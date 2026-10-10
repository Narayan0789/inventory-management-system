const mongoose = require('mongoose');

// Transaction Schema for both Stock-In (Purchases) and Stock-Out (Sales)
const transactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ['stock-in', 'stock-out'],
      required: true
      // 'stock-in' = Purchase / Maal Aaya
      // 'stock-out' = Sale / Maal Bika
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true
      // e.g. INV-1001 for Sale, PUR-1001 for Purchase
    },
    items: [transactionItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    partyName: {
      type: String,
      required: true,
      trim: true
      // Customer Name (for Sales) or Supplier Name (for Purchases)
    },
    partyContact: {
      type: String,
      default: ''
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI / Online', 'Card', 'Credit / Due'],
      default: 'Cash'
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
