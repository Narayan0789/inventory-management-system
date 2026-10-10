const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

// Configure reliable DNS servers for Windows SRV lookup
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // fallback to system default
}

dotenv.config();

const testMongoConnection = async () => {
  const uri = process.env.MONGO_URI;

  console.log('========================================================');
  console.log('🔍 Testing MongoDB Connection...');
  console.log('========================================================');

  if (!uri) {
    console.error('❌ ERROR: MONGO_URI is missing in backend/.env!');
    process.exit(1);
  }

  // Hide password in logs
  const maskedUri = uri.replace(/\/\/(.*):(.*)@/, '//$1:****@');
  console.log(`📡 Connecting to: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('--------------------------------------------------------');
    console.log('✅ SUCCESS: Connected to MongoDB successfully!');
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🔌 Ready State: ${conn.connection.readyState === 1 ? 'Connected (1)' : conn.connection.readyState}`);
    console.log('========================================================');

    process.exit(0);
  } catch (err) {
    console.error('--------------------------------------------------------');
    console.error(`❌ Connection Failed: ${err.message}`);

    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('💡 Tip: Username ya Password galat hai. MongoDB Atlas -> Database Access mein jakar password reset karein.');
    } else if (err.message.includes('querySrv ENOTFOUND') || err.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('💡 Tip: Cluster URL sahi nahi hai. Check karein ki cluster0.xxxx.mongodb.net sahi se copy hua hai.');
    } else if (err.message.includes('whitelist') || err.message.includes('timed out') || err.name === 'MongooseServerSelectionError') {
      console.error('💡 Tip: MongoDB Atlas -> Network Access mein jakar "Allow Access from Anywhere" (0.0.0.0/0) add karein.');
    }

    console.error('========================================================');
    process.exit(1);
  }
};

testMongoConnection();
