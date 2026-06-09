import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 })
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) fetchCart()
        else setCart({ items: [], totalPrice: 0 })
    }, [user])

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart')
            setCart(res.data.cart)
        } catch (error) {
            console.log('Cart error:', error)
        }
    }

    const addToCart = async (productId, quantity = 1) => {
        setLoading(true)
        try {
            const res = await api.post('/cart/add', { productId, quantity })
            setCart(res.data.cart)
            return { success: true }
        } catch (error) {
            return { success: false, message: error.response?.data?.message }
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await api.put('/cart/update', { productId, quantity })
            setCart(res.data.cart)
        } catch (error) {
            console.log('Update error:', error)
        }
    }

    const removeFromCart = async (productId) => {
        try {
            const res = await api.delete(`/cart/remove/${productId}`)
            setCart(res.data.cart)
        } catch (error) {
            console.log('Remove error:', error)
        }
    }

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear')
            setCart({ items: [], totalPrice: 0 })
        } catch (error) {
            console.log('Clear error:', error)
        }
    }

    const cartCount = cart?.items?.length || 0

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            cartCount,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)