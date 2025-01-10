import express from 'express';
import { login, refreshToken, register } from '../controllers/AuthenticationController.js';

const route = express.Router();

route.post('/register', register);
route.post('/login', login);
route.post('/refreshToken', refreshToken);

export default route