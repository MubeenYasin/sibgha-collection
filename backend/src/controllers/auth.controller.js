import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign(
        { _id: userId },
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: config.ACCESS_TOKEN_EXPIRY }
    );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { _id: userId },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: config.REFRESH_TOKEN_EXPIRY }
    );
};

// Register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists - password bhi select karo
        const user = await User.findOne({ email }).select('+password +refreshToken');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Send refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // production mein true karna
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        // Remove refresh token from database
        await User.findByIdAndUpdate(req.user._id, {
            refreshToken: null
        });

        // Clear cookie
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Verify refresh token
        const decoded = jwt.verify(incomingRefreshToken, config.REFRESH_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decoded._id).select('+refreshToken');
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};