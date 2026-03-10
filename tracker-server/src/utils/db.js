const mongoose = require('mongoose');

let cached = global.mongooseConnection;
if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI is not defined in environment variables');
      throw new Error('MONGODB_URI is not defined');
    }

    // Mask password in URI for logging
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI:', maskedUri);

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully!');
        console.log('Database:', mongooseInstance.connection.db.databaseName);
        console.log('Host:', mongooseInstance.connection.host);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        console.error('TIP: Check your connection string, password, and network access settings');
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
