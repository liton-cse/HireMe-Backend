import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn) {
      console.log(`✅ MongoDB Connected Successfully ${conn.connection.host}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
