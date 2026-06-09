
import { Router } from 'express'
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cart.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()

// All cart routes need login
router.get('/', verifyToken, getCart)
router.post('/add', verifyToken, addToCart)
router.put('/update', verifyToken, updateCartItem)
router.delete('/remove/:productId', verifyToken, removeFromCart)
router.delete('/clear', verifyToken, clearCart)

export default router