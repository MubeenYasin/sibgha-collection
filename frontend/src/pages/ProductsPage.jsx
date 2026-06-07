import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const ProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Filter states
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async (filters = {}) => {
        setLoading(true)
        try {
            // Build query string
            const params = new URLSearchParams()
            if (filters.search) params.append('search', filters.search)
            if (filters.category) params.append('category', filters.category)
            if (filters.minPrice) params.append('minPrice', filters.minPrice)
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

            const res = await api.get(`/products?${params.toString()}`)
            setProducts(res.data.products)
        } catch (err) {
            setError('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchProducts({ search, category, minPrice, maxPrice })
    }

    const handleReset = () => {
        setSearch('')
        setCategory('')
        setMinPrice('')
        setMaxPrice('')
        fetchProducts()
    }

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

            {/* Search & Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-5xl mx-auto">
                <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Search */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                        />

                        {/* Category */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                        >
                            <option value="">All Categories</option>
                            <option value="shirts">Shirts</option>
                            <option value="pants">Pants</option>
                            <option value="dresses">Dresses</option>
                            <option value="accessories">Accessories</option>
                            <option value="shoes">Shoes</option>
                        </select>

                        {/* Price Range */}
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Min Price"
                                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max Price"
                                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Products Count */}
            <p className="text-gray-500 text-center mb-4">
                {products.length} products found
            </p>

            {/* Loading */}
            {loading ? (
                <div className="text-center py-20 text-pink-600 text-xl">
                    Loading products...
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">No products found</p>
                    <button
                        onClick={handleReset}
                        className="mt-4 text-pink-600 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => navigate(`/products/${product._id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                        >
                            <img
                                src={product.images[0] || 'https://placehold.co/300x200?text=No+Image'}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 text-lg">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
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