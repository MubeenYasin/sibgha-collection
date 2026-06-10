import Review from '../models/review.model.js'
import Product from '../models/product.model.js'

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0

        res.status(200).json({
            success: true,
            count: reviews.length,
            averageRating,
            reviews
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Add review
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body
        const { productId } = req.params

        // Check product exists
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id
        })

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' })
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            rating,
            comment
        })

        await review.populate('user', 'name')

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update review
export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body

        const review = await Review.findOne({
            _id: req.params.reviewId,
            user: req.user._id
        })

        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        review.rating = rating
        review.comment = comment
        await review.save()

        await review.populate('user', 'name')

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.reviewId,
            user: req.user._id
        })

        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }

        await review.deleteOne()

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
