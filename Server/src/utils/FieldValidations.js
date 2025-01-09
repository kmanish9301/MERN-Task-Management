import * as yup from 'yup';

export const createTaskValidationSchema = yup.object().shape({
    task_name: yup.string().required('Task name is required.'),
    task_description: yup.string().required('Task description is required.'),
    dueDate: yup.date().required('Due date is required.'),
    status: yup
        .string()
        .oneOf(['Pending', 'In Progress', 'Completed'], 'Invalid status.')
        .default('Pending'), // Optional field with a default value
    priority: yup
        .string()
        .oneOf(['Low', 'Medium', 'High'], 'Invalid priority.')
        .default('Low'), // Optional field with a default value
    assignee: yup.array().of(yup.string()),
    creator: yup.array().of(yup.string()).required('Creator is required.'),
});

export const updateTaskValidationSchema = yup.object().shape({
    task_name: yup.string().required('Task name is required.'),
    task_description: yup.string().required('Task description is required.'),
    dueDate: yup.date(),
    status: yup
        .string()
        .oneOf(['Pending', 'In Progress', 'Completed'], 'Invalid status.')
        .default('Pending'), // Optional field with a default value
    priority: yup
        .string()
        .oneOf(['Low', 'Medium', 'High'], 'Invalid priority.')
        .default('Low'), // Optional field with a default value
    assignee: yup.array().of(yup.string()),
    creator: yup.array().of(yup.string()).required('Creator is required.'),
});

export const createUserValidationSchema = yup.object().shape({
    user_name: yup.string().required('Username is required.'),
    email: yup.string().email('Invalid email.').required('Email is required.'),
    password: yup.string().required('Password is required.'),
    role: yup.string().oneOf(['Admin', 'User'], 'Invalid role.').default('User'),
});

export const updateUserValidationSchema = yup.object().shape({
    user_name: yup.string().required('Username is required.'),
    email: yup.string().email('Invalid email.').required('Email is required.'),
    password: yup.string(), // Optional for updating
    role: yup.string().oneOf(['Admin', 'User'], 'Invalid role.').default('User'),
});