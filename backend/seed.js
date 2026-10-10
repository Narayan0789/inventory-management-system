const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();
const User = require('./models/User');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory_system');
    console.log(`Connected to DB for seeding: ${conn.connection.host}`);

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Transaction.deleteMany();
    console.log(' Cleared old records...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Narayan (Admin)',
      email: 'admin@shop.com',
      password: 'password123',
      role: 'admin',
      phone: '9876543210'
    });

    const staffUser = await User.create({
      name: 'Rahul Kumar (Staff)',
      email: 'staff@shop.com',
      password: 'password123',
      role: 'staff',
      phone: '9876501234'
    });

    console.log(' Created Admin & Staff Users');

    // 2. Create Realistic Products (Electronics & Accessories)
    const sampleProducts = [
      {
        name: 'Samsung Galaxy S24 5G',
        sku: 'SAM-S24',
        category: 'Smartphones',
        brand: 'Samsung',
        costPrice: 55000,
        sellingPrice: 69999,
        quantity: 12,
        minStockLimit: 4,
        unit: 'phones',
        description: '256GB Onyx Black flagship smartphone'
      },
      {
        name: 'Apple iPhone 15',
        sku: 'APL-IP15',
        category: 'Smartphones',
        brand: 'Apple',
        costPrice: 62000,
        sellingPrice: 74900,
        quantity: 2, // LOW STOCK!
        minStockLimit: 5,
        unit: 'phones',
        description: '128GB Blue A16 Bionic chip'
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        sku: 'SNY-WH5',
        category: 'Audio',
        brand: 'Sony',
        costPrice: 21000,
        sellingPrice: 28990,
        quantity: 8,
        minStockLimit: 3,
        unit: 'pieces',
        description: 'Noise Cancelling Wireless Over-Ear Headphones'
      },
      {
        name: 'boAt Rockerz 450 Bluetooth Headphones',
        sku: 'BOT-R450',
        category: 'Audio',
        brand: 'boAt',
        costPrice: 850,
        sellingPrice: 1499,
        quantity: 25,
        minStockLimit: 5,
        unit: 'pieces',
        description: 'Wireless Bluetooth on-ear headset'
      },
      {
        name: 'OnePlus Bullets Wireless Z2',
        sku: 'OP-BWZ2',
        category: 'Audio',
        brand: 'OnePlus',
        costPrice: 1100,
        sellingPrice: 1799,
        quantity: 3, // LOW STOCK!
        minStockLimit: 5,
        unit: 'pieces',
        description: 'Bluetooth neckband earphone'
      },
      {
        name: 'Anker 65W Fast GaN Charger',
        sku: 'ANK-65W',
        category: 'Accessories',
        brand: 'Anker',
        costPrice: 1800,
        sellingPrice: 2999,
        quantity: 18,
        minStockLimit: 4,
        unit: 'pieces',
        description: 'High speed 3-port wall adapter'
      },
      {
        name: 'Braided Type-C to Type-C Cable (2m)',
        sku: 'CBL-TC2M',
        category: 'Accessories',
        brand: 'Portronics',
        costPrice: 120,
        sellingPrice: 399,
        quantity: 45,
        minStockLimit: 10,
        unit: 'cables',
        description: '60W fast charging nylon braided cable'
      },
      {
        name: 'SanDisk 128GB Ultra MicroSD Card',
        sku: 'SND-SD128',
        category: 'Storage',
        brand: 'SanDisk',
        costPrice: 650,
        sellingPrice: 1150,
        quantity: 0, // OUT OF STOCK!
        minStockLimit: 5,
        unit: 'cards',
        description: 'Class 10 140MB/s UHS-I Memory card'
      },
      {
        name: 'Logitech MX Master 3S Wireless Mouse',
        sku: 'LOG-MX3S',
        category: 'Accessories',
        brand: 'Logitech',
        costPrice: 6200,
        sellingPrice: 8995,
        quantity: 1, // LOW STOCK!
        minStockLimit: 3,
        unit: 'pieces',
        description: 'Ergonomic performance Bluetooth mouse'
      },
      {
        name: 'Mi 20000mAh Power Bank 3i',
        sku: 'XMI-PB20',
        category: 'Accessories',
        brand: 'Xiaomi',
        costPrice: 1400,
        sellingPrice: 2199,
        quantity: 15,
        minStockLimit: 5,
        unit: 'units',
        description: '18W fast charging dual output power bank'
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(` Inserted ${createdProducts.length} Sample Products`);

    // 3. Create Sample Initial Transactions
    // Purchase transaction (Stock In)
    await Transaction.create({
      transactionType: 'stock-in',
      referenceNumber: 'PUR-1001-889',
      items: [
        {
          product: createdProducts[0]._id,
          productName: createdProducts[0].name,
          sku: createdProducts[0].sku,
          quantity: 15,
          unitPrice: createdProducts[0].costPrice,
          subtotal: 15 * createdProducts[0].costPrice
        },
        {
          product: createdProducts[3]._id,
          productName: createdProducts[3].name,
          sku: createdProducts[3].sku,
          quantity: 30,
          unitPrice: createdProducts[3].costPrice,
          subtotal: 30 * createdProducts[3].costPrice
        }
      ],
      totalAmount: 15 * createdProducts[0].costPrice + 30 * createdProducts[3].costPrice,
      partyName: 'TechSupply Distributors Delhi',
      partyContact: '9811223344',
      paymentMethod: 'UPI / Online',
      handledBy: adminUser._id,
      notes: 'Initial opening stock replenishment'
    });

    // Sale transaction (Stock Out)
    await Transaction.create({
      transactionType: 'stock-out',
      referenceNumber: 'INV-1002-342',
      items: [
        {
          product: createdProducts[0]._id,
          productName: createdProducts[0].name,
          sku: createdProducts[0].sku,
          quantity: 1,
          unitPrice: createdProducts[0].sellingPrice,
          subtotal: createdProducts[0].sellingPrice
        },
        {
          product: createdProducts[6]._id,
          productName: createdProducts[6].name,
          sku: createdProducts[6].sku,
          quantity: 2,
          unitPrice: createdProducts[6].sellingPrice,
          subtotal: 2 * createdProducts[6].sellingPrice
        }
      ],
      totalAmount: createdProducts[0].sellingPrice + 2 * createdProducts[6].sellingPrice,
      partyName: 'Amit Sharma',
      partyContact: '9988776655',
      paymentMethod: 'UPI / Online',
      handledBy: staffUser._id,
      notes: 'Counter sale - Galaxy S24 + 2 braided cables'
    });

    console.log(' Created Initial Stock-In & Stock-Out Transactions');
    console.log('\n=========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Default Credentials:');
    console.log('👑 Admin: admin@shop.com  | Password: password123');
    console.log('👤 Staff: staff@shop.com  | Password: password123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
