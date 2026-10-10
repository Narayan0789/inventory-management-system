const mongoose = require('mongoose');

// Product Schema with Low Stock Thresholds
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU / Product code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    brand: {
      type: String,
      default: 'General'
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost / Buying price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Initial quantity is required'],
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    minStockLimit: {
      type: Number,
      required: [true, 'Minimum stock limit is required for alerts'],
      default: 5,
      min: [1, 'Minimum stock limit must be at least 1']
    },
    unit: {
      type: String,
      default: 'units'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property to calculate real-time Stock Status
// status: 'out-of-stock' | 'low-stock' | 'in-stock'
productSchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) {
    return 'out-of-stock';
  } else if (this.quantity <= this.minStockLimit) {
    return 'low-stock';
  }
  return 'in-stock';
});

module.exports = mongoose.model('Product', productSchema);
