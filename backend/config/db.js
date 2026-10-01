const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * If MongoDB is not yet running locally or credentials are not set,
 * it logs a friendly warning without immediately crashing the server.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vani_technologies';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn('[MongoDB Tip] Make sure MongoDB server is running locally or set MONGODB_URI in your .env file.');
  }
};

module.exports = connectDB;
