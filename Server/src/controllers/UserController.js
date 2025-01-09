import User from "../models/UserModel.js";
import { createUserValidationSchema, updateUserValidationSchema } from "../utils/FieldValidations.js";

export const createUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: true, message: 'User data is required.' });
        }

        const userValidateData = await createUserValidationSchema.validate(req.body, {
            abortEarly: false,
        });

        const userPayload = new User(userValidateData);

        await userPayload.save();

        res.status(201).json({ success: true, message: 'User created successfully' });

    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ error: true, message: 'User already exists.' });
        }
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: true, message: 'User id is required.' });
        }

        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({ error: true, message: 'User not found.' });
        }

        const userValidateData = await updateUserValidationSchema.validate(req.body, {
            abortEarly: false,
        });

        const userPayload = {
            user_name: userValidateData.user_name,
            email: userValidateData.email,
            role: userValidateData.role,
            updatedAt: Date.now(),
        };

        if (userValidateData.password) {
            userPayload.password = userValidateData.password;
        }

        // { new: true }:
        // This option tells Mongoose to return the updated document instead of the original one.
        // Without this option, the method would return the document as it was before the update.

        await User.findByIdAndUpdate(userId, userPayload, { new: true });

        res.status(200).json({ success: true, message: 'User updated successfully' });

    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // Fetch users and populate their tasks
        const usersData = await User.find()
            .populate({
                path: 'tasks',
                select: 'id task_name task_description status dueDate priority createdAt updatedAt', // Include only required fields
            })
            .lean();

        if (!usersData.length) {
            return res.status(404).json({ error: true, message: 'No data found.' });
        }

        // Format the response to include tasks and convert _id to a string
        // Convert ObjectId to string because we made the .lean() to usersData
        const usersResponse = usersData.map((user) => ({
            id: user._id.toString(), // Convert ObjectId to string
            user_name: user.user_name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            tasks: (user.tasks || []).map((task) => ({
                id: task._id.toString(), // Convert ObjectId to string
                task_name: task.task_name,
                task_description: task.task_description,
                status: task.status,
                dueDate: task.dueDate,
                priority: task.priority,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            })),
        }));

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            count: usersResponse.length,
            results: usersResponse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: true, message: 'User id is required.' });
        }

        const userDetails = await User.findById(userId).populate({
            path: 'tasks',
            select: 'id task_name task_description status dueDate priority createdAt updatedAt',
        });

        if (!userDetails) {
            return res.status(404).json({ error: true, message: 'User not found.' });
        }

        const userDetailsResponse = {
            id: userDetails._id,
            user_name: userDetails.user_name,
            email: userDetails.email,
            role: userDetails.role,
            createdAt: userDetails.createdAt,
            updatedAt: userDetails.updatedAt,
            tasks: (userDetails.tasks || []).map((task) => ({
                id: task._id,
                task_name: task.task_name,
                task_description: task.task_description,
                status: task.status,
                dueDate: task.dueDate,
                priority: task.priority,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            }))
        };

        res.status(200).json({ success: true, data: userDetailsResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: true, message: 'User id is required.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found.' });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ success: true, message: 'User deleted successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}