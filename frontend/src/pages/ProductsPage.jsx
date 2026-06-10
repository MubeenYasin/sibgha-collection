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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [currentPage])

    const fetchProducts = async (filters = {}) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.search !== undefined ? filters.search : search)
                params.append('search', filters.search !== undefined ? filters.search : search)
            if (filters.category !== undefined ? filters.category : category)
                params.append('category', filters.category !== undefined ? filters.category : category)
            if (filters.minPrice !== undefined ? filters.minPrice : minPrice)
                params.append('minPrice', filters.minPrice !== undefined ? filters.minPrice : minPrice)
            if (filters.maxPrice !== undefined ? filters.maxPrice : maxPrice)
                params.append('maxPrice', filters.maxPrice !== undefined ? filters.maxPrice : maxPrice)

            params.append('page', filters.page !== undefined ? filters.page : currentPage)
            params.append('limit', 8)

            const res = await api.get(`/products?${params.toString()}`)
            setProducts(res.data.products)
            setTotalPages(res.data.totalPages)
            setTotalProducts(res.data.totalProducts)
        } catch{
            setError('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchProducts({ search, category, minPrice, maxPrice, page: 1 })
    }

    const handleReset = () => {
        setSearch('')
        setCategory('')
        setMinPrice('')
        setMaxPrice('')
        setCurrentPage(1)
        fetchProducts({ search: '', category: '', minPrice: '', maxPrice: '', page: 1 })
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo(0, 0)
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
                {totalProducts} products found
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
                <>
                    {/* Products Grid */}
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">

                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded border ${
                                        currentPage === page
                                            ? 'bg-pink-600 text-white border-pink-600'
                                            : 'bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* Page Info */}
                    <p className="text-center text-gray-500 mt-4">
                        Page {currentPage} of {totalPages}
                    </p>
                </>
            )}
        </div>
    )
}

export default ProductsPage