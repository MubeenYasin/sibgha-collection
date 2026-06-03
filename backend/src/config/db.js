// ✅ Correct
import mongoose from 'mongoose';

const connectDB = async () => {  // no next here
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connectedd : ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;