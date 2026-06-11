import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Cart from '../models/cart.model.js'
import Product from '../models/product.model.js'
import{v2 as cloudinary} from 'cloudinary'

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalProducts = await Product.countDocuments({ isActive: true })
        const totalCarts = await Cart.countDocuments()

        // Recent users
        const recentUsers = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt')

        // Recent products
        const recentProducts = await Product.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name price category images')

        // Products by category
        const productsByCategory = await Product.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalCarts,
            },
            recentUsers,
            recentProducts,
            productsByCategory
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

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
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ name, email, password, role });

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

// Get Profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, password, newPassword } = req.body

        const user = await User.findById(req.user._id).select('+password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Update name
        if (name) user.name = name

        // Update email
        if (email) user.email = email

        // Update password
        if (password && newPassword) {
            const isPasswordValid = await user.isPasswordCorrect(password)
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Current password is incorrect' })
            }
            user.password = newPassword
        }

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Avatar
export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' })
        }

        // Upload to cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'sibgha-collection/avatars' },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(req.file.buffer)
        })

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: result.secure_url },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
