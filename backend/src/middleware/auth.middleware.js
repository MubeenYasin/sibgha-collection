import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token not found' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid access token' });
    }
};