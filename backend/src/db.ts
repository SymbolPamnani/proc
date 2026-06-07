import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("MONGO_URI =", process.env.MONGO_URI);

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miniticketdb';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}
