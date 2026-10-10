const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc   Get comprehensive dashboard metrics & analytics
// @route  GET /api/dashboard/stats
// @access Private
const getDashboardStats = async (req, res) => {
  try {
    // 1. Product & Stock Metrics
    const totalProducts = await Product.countDocuments();
    
    const stockAgg = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$quantity' },
          totalInventoryValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } }
        }
      }
    ]);
    const totalStockUnits = stockAgg[0] ? stockAgg[0].totalUnits : 0;
    const totalInventoryValue = stockAgg[0] ? stockAgg[0].totalInventoryValue : 0;

    // 2. Low Stock & Out of Stock counts
    const lowStockCount = await Product.countDocuments({
      $expr: {
        $and: [
          { $lte: ['$quantity', '$minStockLimit'] },
          { $gt: ['$quantity', 0] }
        ]
      }
    });

    const outOfStockCount = await Product.countDocuments({ quantity: 0 });

    // 3. Sales Metrics (Today & All Time)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaySalesAgg = await Transaction.aggregate([
      {
        $match: {
          transactionType: 'stock-out',
          createdAt: { $gte: startOfToday }
        }
      },
      {
        $group: {
          _id: null,
          todayTotal: { $sum: '$totalAmount' },
          todayCount: { $sum: 1 }
        }
      }
    ]);
    const todaySales = todaySalesAgg[0] ? todaySalesAgg[0].todayTotal : 0;
    const todayOrdersCount = todaySalesAgg[0] ? todaySalesAgg[0].todayCount : 0;

    const totalSalesAgg = await Transaction.aggregate([
      { $match: { transactionType: 'stock-out' } },
      {
        $group: {
          _id: null,
          lifetimeSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);
    const lifetimeSales = totalSalesAgg[0] ? totalSalesAgg[0].lifetimeSales : 0;
    const totalOrders = totalSalesAgg[0] ? totalSalesAgg[0].totalOrders : 0;

    // 4. Category Distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          stock: { $sum: '$quantity' }
        }
      },
      { $sort: { stock: -1 } }
    ]);

    // 5. Recent 5 Transactions
    const recentTransactions = await Transaction.find()
      .populate('handledBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Top Low Stock Items (Needs immediate restock)
    const criticalStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$minStockLimit'] }
    })
      .sort({ quantity: 1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalStockUnits,
        totalInventoryValue,
        lowStockCount,
        outOfStockCount,
        criticalAlertsTotal: lowStockCount + outOfStockCount,
        todaySales,
        todayOrdersCount,
        lifetimeSales,
        totalOrders,
        categoryStats,
        recentTransactions,
        criticalStockItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
