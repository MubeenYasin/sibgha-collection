import { Router } from 'express';
import { register, login, logout, refreshAccessToken } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', refreshAccessToken);

export default router;