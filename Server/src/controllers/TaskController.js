import TaskModel from "../models/TaskModel.js";
import User from "../models/UserModel.js";
import { createTaskValidationSchema, updateTaskValidationSchema } from "../utils/FieldValidations.js";

export const createTask = async (req, res) => {
    try {
        const headerRole = req.headers['role'].toLowerCase();
        if (headerRole !== 'admin') {
            return res.status(403).json({ error: true, message: 'You are not authorized to create tasks.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: true, message: 'Task data is required.' });
        }

        // { abortEarly: false } ensures that all errors are reported, not just the first one.
        const validateData = await createTaskValidationSchema.validate(req.body, { abortEarly: false });

        // Check if a task with the same name already exists
        const existingTask = await TaskModel.findOne({ task_name: validateData.task_name });
        if (existingTask) {
            return res.status(400).json({ error: true, message: 'Task with the same name already exists.' });
        }

        // Validate each assignee to ensure they exist
        const assignees = await User.find({
            _id: { $in: validateData.assignee },
            // role: 'User',
        });

        if (assignees.length !== validateData.assignee.length) {
            return res.status(400).json({ error: true, message: 'One or more assignees are invalid.' });
        }

        // Create a new task
        const taskPayload = new TaskModel(validateData);

        // Save task to the database
        const savedTask = await taskPayload.save();

        // Update the User's tasks field to include the newly created task
        await User.updateMany(
            { _id: { $in: validateData.assignee } },
            { $push: { tasks: savedTask._id } }
        );

        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = error.inner.map(err => ({ error: true, field: err.path, message: err.message }));
            return res.status(400).json({ errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: true, message: 'Task already exists.' });
        }
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const headerRole = req.headers['role'].toLowerCase();
        if (headerRole !== 'admin') {
            return res.status(403).json({ error: true, message: 'You are not authorized to update tasks.' });
        }

        const taskId = req.params.id;

        if (!taskId) {
            return res.status(400).json({ error: true, message: 'Task id is required.' });
        }

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: true, message: 'Task not found.' });
        }

        // Validate the data from the request body
        const validateData = await updateTaskValidationSchema.validate(req.body, { abortEarly: false });

        // Skip task name duplication check if task name is not being updated
        if (validateData.task_name && validateData.task_name !== task.task_name) {
            const existingTask = await TaskModel.findOne({ task_name: validateData.task_name });
            if (existingTask) {
                return res.status(400).json({ error: true, message: 'Task with the same name already exists.' });
            }
        }

        // Validate each assignee to ensure they exist (if assignees are provided)
        if (validateData.assignee) {
            const assignees = await User.find({ _id: { $in: validateData.assignee } });

            // Check if all provided assignees exist
            if (assignees.length !== validateData.assignee.length) {
                return res.status(400).json({ error: true, message: 'One or more assignees are invalid.' });
            }
        }

        // Update the task with validated data (excluding the assignee field for now)
        Object.assign(task, validateData);

        // Save the updated task to the database
        const updatedTask = await task.save();

        // Handle updating assignees
        if (validateData.assignee) {
            // Remove task from users who are no longer assigned to this task
            await User.updateMany(
                { tasks: task._id, _id: { $nin: validateData.assignee } },
                { $pull: { tasks: task._id } }
            );

            // Add the task ID to the newly assigned users' task list
            await User.updateMany(
                { _id: { $in: validateData.assignee } },
                // Use $addToSet to avoid duplicates
                { $addToSet: { tasks: updatedTask._id } }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
        });

    } catch (error) {
        // Handle validation or other errors
        if (error.name === 'ValidationError') {
            const errors = error.inner.map(err => ({ error: true, field: err.path, message: err.message }));
            return res.status(400).json({ errors });
        }

        // Handle MongoDB duplicate error code (11000)
        if (error.code === 11000) {
            return res.status(400).json({ error: true, message: 'Task already exists.' });
        }

        // Internal server error
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};


export const getAllTasks = async (req, res) => {
    try {
        const tasksData = await TaskModel.find().lean();

        if (!tasksData.length) {
            return res.status(404).json({ error: true, message: 'No data found.' });
        }

        const tasksResponse = tasksData.map((task) => ({
            id: task._id,
            task_name: task.task_name,
            task_description: task.task_description,
            status: task.status,
            dueDate: task.dueDate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            priority: task.priority,
            assignee: task.assignee,
        }));

        res.status(200).json({ success: true, message: "Tasks retrieved successfully", count: tasksResponse.length, results: tasksResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}

export const getTaskById = async (req, res) => {
    try {
        const id = await req.params.id;

        if (!id) {
            return res.status(400).json({ error: true, message: 'Task ID is required.' });
        }

        const taskDetails = await TaskModel.findById(id);

        if (!taskDetails) {
            return res.status(404).json({ error: true, message: 'Task not found.' });
        }

        const taskResponse = {
            id: taskDetails._id,
            task_name: taskDetails.task_name,
            task_description: taskDetails.task_description,
            status: taskDetails.status,
            dueDate: taskDetails.dueDate,
            createdAt: taskDetails.createdAt,
            updatedAt: taskDetails.updatedAt,
            priority: taskDetails.priority,
            assignee: taskDetails.assignee,
        };

        res.status(200).json({ success: true, data: taskResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: true, message: 'Task ID is required.' });
        }

        const task = await TaskModel.findById(id);

        if (!task) {
            return res.status(404).json({ error: true, message: 'Task not found.' });
        }

        // Remove task from User's tasks array
        await User.updateMany(
            { tasks: id },  // Find users who have this task in their tasks array
            { $pull: { tasks: id } }  // Remove the task id from the tasks array
        );

        await TaskModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Task deleted successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}