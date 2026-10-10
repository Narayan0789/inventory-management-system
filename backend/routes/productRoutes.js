const express = require('express');
const router = express.Router();
const {
  getProducts,
  getLowStockAlerts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getProducts);
router.get('/alerts/low-stock', protect, getLowStockAlerts);
router.get('/meta/categories', protect, getCategories);
router.get('/:id', protect, getProductById);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
