const Product = require('../models/Product');

// @desc   Get all products with search, category & stock status filters
// @route  GET /api/products
// @access Private
const getProducts = async (req, res) => {
  try {
    const { search, category, status, sort } = req.query;

    const query = {};

    // Search by product name, sku or brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    let products = await Product.find(query).sort(sort ? { [sort]: 1 } : { createdAt: -1 });

    // Filter by virtual stock status if specified
    if (status && status !== 'all') {
      if (status === 'out-of-stock') {
        products = products.filter((p) => p.quantity === 0);
      } else if (status === 'low-stock') {
        products = products.filter((p) => p.quantity > 0 && p.quantity <= p.minStockLimit);
      } else if (status === 'in-stock') {
        products = products.filter((p) => p.quantity > p.minStockLimit);
      }
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get low stock alert products
// @route  GET /api/products/alerts/low-stock
// @access Private
const getLowStockAlerts = async (req, res) => {
  try {
    // MongoDB query to find products where quantity <= minStockLimit
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStockLimit'] }
    }).sort({ quantity: 1 }); // Lowest quantity first (out-of-stock first)

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single product by ID
// @route  GET /api/products/:id
// @access Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new product
// @route  POST /api/products
// @access Private (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, sku, category, brand, costPrice, sellingPrice, quantity, minStockLimit, unit, description } = req.body;

    const existingSku = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existingSku) {
      return res.status(400).json({ success: false, message: 'A product with this SKU code already exists' });
    }

    const product = await Product.create({
      name,
      sku: sku.trim().toUpperCase(),
      category,
      brand: brand || 'General',
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity) || 0,
      minStockLimit: Number(minStockLimit) || 5,
      unit: unit || 'units',
      description: description || ''
    });

    res.status(201).json({
      success: true,
      data: product,
      message: `Product "${product.name}" created successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update product details
// @route  PUT /api/products/:id
// @access Private (Admin only)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.sku && req.body.sku !== product.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku.trim().toUpperCase() });
      if (existingSku && existingSku._id.toString() !== product._id.toString()) {
        return res.status(400).json({ success: false, message: 'This SKU is already assigned to another product' });
      }
      req.body.sku = req.body.sku.trim().toUpperCase();
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: product,
      message: `Product "${product.name}" updated successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Product "${product.name}" (${product.sku}) deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all unique product categories
// @route  GET /api/products/meta/categories
// @access Private
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getLowStockAlerts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
