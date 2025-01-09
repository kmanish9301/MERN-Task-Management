import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        user_name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, enum: ['Admin', 'User'], default: 'User' },
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;