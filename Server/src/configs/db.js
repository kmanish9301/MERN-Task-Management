import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
const URL = process.env.MONGODB_URL || "mongodb://localhost:27017/TaskShell";

const connectDB = async (app) => {
    try {
        await mongoose.connect(URL);
        console.log("DB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to the database:", err.message);
        process.exit(1);
    }
};

export default connectDB;