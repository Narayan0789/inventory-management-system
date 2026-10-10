const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for Windows MongoDB SRV lookup
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // fallback to system default
}

// MongoDB Database Connection Setup
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventory_system';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host} [DB: ${conn.connection.name}]`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
