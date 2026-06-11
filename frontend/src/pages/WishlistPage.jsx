import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
    const { addToCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 text-xl mb-4">
                    Please login to view wishlist
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
                >
                    Login
                </button>
            </div>
        )
    }

    if (!wishlist.products || wishlist.products.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-4xl mb-4">❤️</p>
                <p className="text-gray-500 text-xl mb-4">
                    Your wishlist is empty!
                </p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
                >
                    Browse Products
                </button>
            </div>
        )
    }

    const handleAddToCart = async (productId) => {
        const result = await addToCart(productId, 1)
        if (result.success) {
            toast.success('Added to cart!')
        } else {
            toast.error(result.message || 'Failed to add to cart')
        }
    }

    const handleRemove = async (productId) => {
        await removeFromWishlist(productId)
        toast.success('Removed from wishlist!')
    }

    const handleClear = async () => {
        await clearWishlist()
        toast.success('Wishlist cleared!')
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto">

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
                    My Wishlist ❤️
                </h2>

                {/* Clear Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleClear}
                        className="text-red-500 hover:underline text-sm"
                    >
                        Clear Wishlist
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Product Image */}
                            <div className="relative">
                                <img
                                    src={product.images?.[0] || 'https://placehold.co/300x200?text=No+Image'}
                                    alt={product.name}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="w-full h-48 object-cover cursor-pointer"
                                />
                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(product._id)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                                >
                                    ❤️
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="font-bold text-gray-800 cursor-pointer hover:text-pink-600"
                                >
                                    {product.name}
                                </h3>
                                <p className="text-pink-600 font-bold mt-1">
                                    Rs. {product.price}
                                </p>
                                <p className={`text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </p>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(product._id)}
                                    disabled={product.stock === 0}
                                    className="w-full bg-pink-600 text-white py-2 rounded mt-3 hover:bg-pink-700 disabled:opacity-50 text-sm"
                                >
                                    Add to Cart 🛒
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WishlistPage