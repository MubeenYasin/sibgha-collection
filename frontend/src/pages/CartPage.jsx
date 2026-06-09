import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 text-xl mb-4">Please login to view cart</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
                >
                    Login
                </button>
            </div>
        )
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 text-xl mb-4">Your cart is empty!</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
                >
                    Shop Now
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-4xl mx-auto">

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
                    Your Cart 🛒
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                            >
                                {/* Product Image */}
                                <img
                                    src={item.product?.images?.[0] || 'https://placehold.co/100x100?text=No+Image'}
                                    alt={item.product?.name}
                                    className="w-24 h-24 object-cover rounded"
                                />

                                {/* Product Info */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">
                                        {item.product?.name}
                                    </h3>
                                    <p className="text-pink-600 font-bold mt-1">
                                        Rs. {item.product?.price}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold text-lg">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                            className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Item Total + Remove */}
                                <div className="flex flex-col items-end justify-between">
                                    <p className="font-bold text-gray-800">
                                        Rs. {item.product?.price * item.quantity}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart */}
                        <button
                            onClick={clearCart}
                            className="text-red-500 hover:underline text-sm"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Order Summary
                        </h3>

                        <div className="space-y-2 mb-4">
                            {cart.items.map((item) => (
                                <div key={item._id} className="flex justify-between text-gray-600 text-sm">
                                    <span>{item.product?.name} x {item.quantity}</span>
                                    <span>Rs. {item.product?.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-pink-600">Rs. {cart.totalPrice}</span>
                        </div>

                        <button
                            onClick={() => navigate('/products')}
                            className="w-full bg-pink-600 text-white py-3 rounded-lg mt-6 hover:bg-pink-700 font-bold"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage