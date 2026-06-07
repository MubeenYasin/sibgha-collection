import { useState, useEffect } from 'react'
import api from '../services/api'

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products')
            setProducts(res.data.products)
        } catch{
            setError('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="text-center py-20 text-pink-600 text-xl">
            Loading products...
        </div>
    )

    if (error) return (
        <div className="text-center py-20 text-red-500 text-xl">
            {error}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
                Our Collection
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-500">No products found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Product Image */}
                            <img
                                src={product.images[0] || 'https://placehold.co/300x200?text=No+Image'}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 text-lg">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {product.description}
                                </p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-pink-600 font-bold text-lg">
                                        Rs. {product.price}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        Stock: {product.stock}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductsPage
