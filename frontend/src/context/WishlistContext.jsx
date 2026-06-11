import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState({ products: [] })
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) fetchWishlist()
        else setWishlist({ products: [] })
    }, [user])

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist')
            setWishlist(res.data.wishlist)
        } catch (error) {
            console.log('Wishlist error:', error)
        }
    }

    const addToWishlist = async (productId) => {
        setLoading(true)
        try {
            const res = await api.post('/wishlist/add', { productId })
            setWishlist(res.data.wishlist)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message
            }
        } finally {
            setLoading(false)
        }
    }

    const removeFromWishlist = async (productId) => {
        try {
            const res = await api.delete(`/wishlist/remove/${productId}`)
            setWishlist(res.data.wishlist)
        } catch (error) {
            console.log('Remove error:', error)
        }
    }

    const clearWishlist = async () => {
        try {
            await api.delete('/wishlist/clear')
            setWishlist({ products: [] })
        } catch (error) {
            console.log('Clear error:', error)
        }
    }

    const isInWishlist = (productId) => {
        return wishlist?.products?.some(p => p._id === productId)
    }

    const wishlistCount = wishlist?.products?.length || 0

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            wishlistCount,
            addToWishlist,
            removeFromWishlist,
            clearWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext)
