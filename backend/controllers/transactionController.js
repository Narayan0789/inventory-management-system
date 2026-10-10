const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// Helper to generate Unique Reference Number
const generateRefNumber = (prefix) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${timestamp}-${random}`;
};

// @desc   Record Stock-In (Purchase from Supplier / Receiving Goods)
// @route  POST /api/transactions/stock-in
// @access Private (Admin & Staff)
const recordStockIn = async (req, res) => {
  try {
    const { items, supplierName, supplierContact, paymentMethod, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one item' });
    }

    if (!supplierName) {
      return res.status(400).json({ success: false, message: 'Supplier name is required' });
    }

    let totalAmount = 0;
    const processedItems = [];

    // Process each item and increment product stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
      }

      const qty = Number(item.quantity);
      const price = Number(item.unitPrice || product.costPrice);
      const subtotal = qty * price;
      totalAmount += subtotal;

      // Update product inventory: Opening + Stock In
      product.quantity += qty;
      // Optionally update latest cost price
      if (item.unitPrice) {
        product.costPrice = price;
      }
      await product.save();

      processedItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: qty,
        unitPrice: price,
        subtotal
      });
    }

    const referenceNumber = generateRefNumber('PUR');

    const transaction = await Transaction.create({
      transactionType: 'stock-in',
      referenceNumber,
      items: processedItems,
      totalAmount,
      partyName: supplierName,
      partyContact: supplierContact || '',
      paymentMethod: paymentMethod || 'Cash',
      handledBy: req.user._id,
      notes: notes || ''
    });

    const populated = await Transaction.findById(transaction._id).populate('handledBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populated,
      message: `Stock-In of ₹${totalAmount.toLocaleString()} recorded successfully (${referenceNumber})`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Record Stock-Out / Sale (Customer billing with inventory deduction)
// @route  POST /api/transactions/stock-out
// @access Private (Admin & Staff)
const recordStockOut = async (req, res) => {
  try {
    const { items, customerName, customerContact, paymentMethod, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one item for sale' });
    }

    if (!customerName) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    // STEP 1: VALIDATE ALL ITEMS FOR SUFFICIENT STOCK BEFORE DEDUCTING
    const productsToUpdate = [];
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      const requestedQty = Number(item.quantity);
      if (requestedQty <= 0) {
        return res.status(400).json({ success: false, message: `Quantity for "${product.name}" must be greater than 0` });
      }

      // Check if stock is sufficient
      if (product.quantity < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.quantity} ${product.unit}, Requested: ${requestedQty} ${product.unit}`
        });
      }

      const unitPrice = Number(item.unitPrice || product.sellingPrice);
      const subtotal = requestedQty * unitPrice;
      totalAmount += subtotal;

      productsToUpdate.push({ product, deductQty: requestedQty });
      processedItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: requestedQty,
        unitPrice,
        subtotal
      });
    }

    // STEP 2: DEDUCT STOCK SAFELY
    for (const entry of productsToUpdate) {
      entry.product.quantity -= entry.deductQty;
      await entry.product.save();
    }

    // STEP 3: CREATE TRANSACTION & INVOICE
    const referenceNumber = generateRefNumber('INV');

    const transaction = await Transaction.create({
      transactionType: 'stock-out',
      referenceNumber,
      items: processedItems,
      totalAmount,
      partyName: customerName,
      partyContact: customerContact || '',
      paymentMethod: paymentMethod || 'Cash',
      handledBy: req.user._id,
      notes: notes || ''
    });

    const populated = await Transaction.findById(transaction._id).populate('handledBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populated,
      message: `Sale completed! Invoice ${referenceNumber} generated (Total: ₹${totalAmount.toLocaleString()})`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all transactions (Sales & Purchases)
// @route  GET /api/transactions
// @access Private
const getTransactions = async (req, res) => {
  try {
    const { type, search } = req.query;

    const query = {};
    if (type && type !== 'all') {
      query.transactionType = type;
    }

    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { partyName: { $regex: search, $options: 'i' } },
        { 'items.productName': { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('handledBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single transaction details (For Invoice Printing)
// @route  GET /api/transactions/:id
// @access Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('handledBy', 'name email role phone');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  recordStockIn,
  recordStockOut,
  getTransactions,
  getTransactionById
};
