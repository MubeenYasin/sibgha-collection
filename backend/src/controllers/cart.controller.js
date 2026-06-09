import Cart from '../models/cart.model.js'
import Product from '../models/product.model.js'

// Get cart
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product')

        if (!cart) {
            cart = { items: [], totalPrice: 0 }
        }

        res.status(200).json({
            success: true,
            cart
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        // Check product exists
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock' })
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] })
        }

        // Check if product already in cart
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        )

        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity })
        }

        // Calculate total price
        await cart.populate('items.product')
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity)
        }, 0)

        await cart.save()

        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        )

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' })
        }

        if (quantity <= 0) {
            // Remove item
            cart.items = cart.items.filter(
                item => item.product.toString() !== productId
            )
        } else {
            item.quantity = quantity
        }

        // Recalculate total
        await cart.populate('items.product')
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity)
        }, 0)

        await cart.save()

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' })
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        )

        // Recalculate total
        await cart.populate('items.product')
        cart.totalPrice = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity)
        }, 0)

        await cart.save()

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Clear cart
export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [], totalPrice: 0 }
        )

        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
