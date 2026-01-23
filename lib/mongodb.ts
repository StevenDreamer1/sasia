import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://stifenadmin:Stifen505@sasia.5ezxgbc.mongodb.net/?appName=Sasia";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI in lib/mongodb.ts");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;