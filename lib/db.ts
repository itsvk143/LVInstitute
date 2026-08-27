import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof import('mongoose') | null; promise: Promise<typeof import('mongoose')> | null };
}

function getMongoUri(): string {
  let uri = (process.env.MONGODB_URI || '').trim();
  if (uri.startsWith('mmongodb')) {
    uri = uri.replace(/^mmongodb/, 'mongodb');
  }
  return uri;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local or Vercel Environment Variables');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection failure:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
