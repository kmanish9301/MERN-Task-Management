import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createUserValidationSchema } from '../utils/FieldValidations.js';
import User from '../models/UserModel.js';

export const generateToken = (payload, secret, expiresIn) => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: true, message: "Access token is required" });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: true, message: 'Invalid access token.' });
        }
        req.user = user;
        next();
    });
}

export const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: true, message: 'User data is required.' });
        }
        const userValidateData = await createUserValidationSchema.validate(req.body, {
            abortEarly: false,
        });

        const existingUser = await User.findOne({ email: userValidateData.email });
        if (existingUser) {
            return res.status(400).json({ error: true, message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userPayload = new User({
            user_name: userValidateData.user_name,
            email: userValidateData.email,
            password: hashedPassword,
            role: userValidateData.role,
        });

        const accessToken = generateToken(userPayload.toObject(), process.env.ACCESS_TOKEN_SECRET,
            process.env.JWT_ACCESS_EXPIRATION);
        const refreshToken = generateToken(userPayload.toObject(), process.env.ACCESS_TOKEN_SECRET,
            process.env.JWT_ACCESS_EXPIRATION);

        userPayload.refreshToken = refreshToken;
        userPayload.accessToken = accessToken;
        await userPayload.save();

        return res.status(201).json({ success: true, message: 'User created successfully' });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}

export const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: true, message: "User Data Required." })
        }

        const userValidateData = await createUserValidationSchema.validate(req.body, {
            abortEarly: false,
        });

        const user = await User.findOne({ email: userValidateData.email });

        if (!user || !(await bcrypt.compare(userValidateData.password, user.password))) {
            return res.status(401).json({ error: true, message: "Invalid credentials." });
        }

        const accessToken = generateToken(user.toObject(), process.env.ACCESS_TOKEN_SECRET,
            process.env.JWT_ACCESS_EXPIRATION);
        const refreshToken = generateToken(user.toObject(), process.env.ACCESS_TOKEN_SECRET,
            process.env.JWT_ACCESS_EXPIRATION);

        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        await user.save();

        return res.json({ success: true, message: "Logged in successfully", accessToken, refreshToken });

    } catch (error) {
        console.log("error", error);

    }
}

export const refreshToken = async (req, res) => {
    try {

        if (!req.body.refreshToken) {
            return res.status(401).json({ error: true, message: 'No refresh token provided.' });
        }

        const refreshToken = req.body.refreshToken;

        const payload = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET);

        if (!payload) {
            return res.status(403).json({ error: true, message: 'Invalid refresh token.' });
        }

        const user = await User.findById(payload.id);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found.' });
        }

        const newAccessToken = generateToken(user.toObject(), process.env.ACCESS_TOKEN_SECRET,
            process.env.JWT_ACCESS_EXPIRATION);


        return res.json({ success: true, message: 'Token refreshed successfully', newAccessToken });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}
