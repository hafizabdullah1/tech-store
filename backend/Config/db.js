import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const link = process.env.MONGO_URL;
    const conn = await mongoose.connect(link);
    console.log(`Database Connected ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;