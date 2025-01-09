import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/UserController.js';

const route = express.Router();

route.post('/create_user', createUser);
route.get('/get_users', getAllUsers);
route.get('/get_user_details/:id', getUserById);
route.delete('/delete_user/:id', deleteUser);
route.put('/update_user/:id', updateUser);

export default route;