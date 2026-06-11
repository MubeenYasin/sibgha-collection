import Wishlist from '../models/wishlist.model.js'

// Get wishlist
export const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products')

        if (!wishlist) {
            wishlist = { products: [] }
        }

        res.status(200).json({
            success: true,
            wishlist
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body

        let wishlist = await Wishlist.findOne({ user: req.user._id })

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] })
        }

        // Check if already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' })
        }

        wishlist.products.push(productId)
        await wishlist.save()
        await wishlist.populate('products')

        res.status(200).json({
            success: true,
            message: 'Added to wishlist',
            wishlist
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        const wishlist = await Wishlist.findOne({ user: req.user._id })

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' })
        }

        wishlist.products = wishlist.products.filter(
            p => p.toString() !== productId
        )

        await wishlist.save()
        await wishlist.populate('products')

        res.status(200).json({
            success: true,
            message: 'Removed from wishlist',
            wishlist
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Clear wishlist
export const clearWishlist = async (req, res) => {
    try {
        await Wishlist.findOneAndUpdate(
            { user: req.user._id },
            { products: [] }
        )

        res.status(200).json({
            success: true,
            message: 'Wishlist cleared'
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}