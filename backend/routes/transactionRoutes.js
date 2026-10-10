const express = require('express');
const router = express.Router();
const {
  recordStockIn,
  recordStockOut,
  getTransactions,
  getTransactionById
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/stock-in', protect, recordStockIn);
router.post('/stock-out', protect, recordStockOut);
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransactionById);

module.exports = router;
