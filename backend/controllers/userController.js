import UserModel from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- User Signup ---
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ result: newUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong during signup.' });
    }
};

// --- User Login ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong during login.' });
    }
};

// --- Google Login/Signup ---
export const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            // User exists, log them in
            const jwtToken = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ result: existingUser, token: jwtToken });
        } else {
            // User doesn't exist, create a new account
            const password = email + process.env.JWT_SECRET; // Create a dummy password
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                // You could add 'picture' to your UserModel to save the user's avatar
            });

            await newUser.save();

            const jwtToken = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ result: newUser, token: jwtToken });
        }
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: 'Google Sign-In failed. Please try again.' });
    }
};


// --- Get User Profile ---
export const getUser = async (req, res) => {
    try {
        // The user ID is added to req.user by the auth middleware
        const user = await UserModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user profile.' });
    }
};

// --- Update User Profile ---
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user profile.' });
    }
};

// --- Delete User Account ---
export const deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};