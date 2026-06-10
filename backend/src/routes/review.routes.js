import { Router } from 'express'
import {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview
} from '../controllers/review.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/:productId', getProductReviews)
router.post('/:productId', verifyToken, addReview)
router.put('/:reviewId', verifyToken, updateReview)
router.delete('/:reviewId', verifyToken, deleteReview)

export default router