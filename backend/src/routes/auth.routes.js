import { Router } from 'express';
import {
    register,
    login,
    logout,
    refreshAccessToken,
    getProfile,
    updateProfile,
    getDashboardStats,
    updateAvatar
} from '../controllers/auth.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', refreshAccessToken);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/avatar', verifyToken, upload.single('avatar'), updateAvatar);
router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);

export default router;