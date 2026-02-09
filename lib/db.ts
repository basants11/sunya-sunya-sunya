/**
 * MongoDB Database Connection Utility
 *
 * This module provides a singleton MongoDB connection using Mongoose.
 * It handles connection caching for serverless environments (Next.js)
 * and provides proper error handling and connection management.
 *
 * FREE TIER: MongoDB Atlas offers 512MB free storage
 */

import mongoose from "mongoose";

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global type declaration for mongoose cache
 */
declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

/**
 * Cached connection for serverless environments
 * Next.js hot reloads can create multiple connections, so we cache the connection
 */
const cached = global.mongooseCache ?? { conn: null, promise: null };

// Store in global for hot reload persistence
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB
 * Uses connection caching to prevent multiple connections in serverless environments
 *
 * @returns {Promise<typeof mongoose>} Mongoose instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Runtime check for MONGODB_URI
  if (!MONGODB_URI) {
    // In development, provide a graceful fallback
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[DB] MONGODB_URI not configured. Using mock database for development.',
      );
      console.warn(
        '[DB] To enable database features, set MONGODB_URI in .env.local',
      );
      // Return a cached connection even without MongoDB
      if (cached.conn) return cached.conn;
      // Return mongoose as-is for development - connections won't actually work but won't crash
      return mongoose;
    }
    
    // In production, require proper configuration
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if no promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for testing and cleanup
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("✅ MongoDB disconnected");
  }
}

/**
 * Check if MongoDB is connected
 * @returns {boolean} Connection status
 */
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1; // 1 = connected
}

// Export mongoose for direct access if needed
export { mongoose };

// Default export for convenience
export default connectToDatabase;
