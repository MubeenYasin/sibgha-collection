import { Router } from 'express'
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from '../controllers/wishlist.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', verifyToken, getWishlist)
router.post('/add', verifyToken, addToWishlist)
router.delete('/remove/:productId', verifyToken, removeFromWishlist)
router.delete('/clear', verifyToken, clearWishlist)

export default router