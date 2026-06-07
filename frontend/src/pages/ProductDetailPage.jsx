import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const ProductDetailPage = () => {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedImage, setSelectedImage] = useState(0)

    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`)
            setProduct(res.data.product)
        } catch{
            setError('Product not found')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="text-center py-20 text-pink-600 text-xl">
            Loading...
        </div>
    )

    if (error) return (
        <div className="text-center py-20 text-red-500 text-xl">
            {error}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">

                    {/* Left - Images */}
                    <div>
                        {/* Main Image */}
                        <img
                            src={product.images[selectedImage] || 'https://placehold.co/400x400?text=No+Image'}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.name}-${index}`}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 
                                            ${selectedImage === index ? 'border-pink-600' : 'border-gray-200'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div>
                        {/* Category Badge */}
                        <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                            {product.category}
                        </span>

                        {/* Name */}
                        <h1 className="text-3xl font-bold text-gray-800 mt-3">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p className="text-3xl font-bold text-pink-600 mt-3">
                            Rs. {product.price}
                        </p>

                        {/* Stock */}
                        <p className={`mt-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                        </p>

                        {/* Divider */}
                        <hr className="my-4" />

                        {/* Description */}
                        <h3 className="font-bold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Divider */}
                        <hr className="my-4" />

                        {/* Admin Buttons */}
                        {user && user.role === 'admin' && (
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit Product
                                </button>
                            </div>
                        )}

                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/products')}
                            className="mt-4 text-pink-600 hover:underline flex items-center gap-1"
                        >
                            ← Back to Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage