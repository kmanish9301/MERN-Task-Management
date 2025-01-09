import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        task_name: { type: String, required: true },
        task_description: { type: String, required: true },
        status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
        // Reference to the User model
        assignee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        creator: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        dueDate: { type: Date, required: true },
        priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
        // history: [
        //     {
        //         changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        //         changedAt: { type: Date, default: Date.now },
        //         changes: String,
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;