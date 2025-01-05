import mongoose from "mongoose";

const dbconnect = () => {
    (async () => {
        try {
          await mongoose.connect('mongodb://localhost:27017/multi-vendor', {
            serverSelectionTimeoutMS: 5000, // Optional timeout setting
          });
          console.log('MongoDB connected successfully');
        } catch (error) {
          console.error('MongoDB connection failed:', error.message);
        }
      })();
}

export default dbconnect;


