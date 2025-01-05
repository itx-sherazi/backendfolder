import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const dbconnect = () => {
  (async () => {
    try {
      // Use the MongoDB URI from the environment variable
      const mongoURI = process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/multi-vendor';
      
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Optional timeout setting
      });

      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
    }
  })();
};

export default dbconnect;
