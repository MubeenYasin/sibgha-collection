import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
    const [stats, setStats] = useState(null)
    const [recentUsers, setRecentUsers] = useState([])
    const [recentProducts, setRecentProducts] = useState([])
    const [productsByCategory, setProductsByCategory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
            return
        }
        fetchDashboard()
    }, [user])

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/auth/dashboard')
            setStats(res.data.stats)
            setRecentUsers(res.data.recentUsers)
            setRecentProducts(res.data.recentProducts)
            setProductsByCategory(res.data.productsByCategory)
        } catch{
            setError('Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="text-center py-20 text-pink-600 text-xl">
            Loading Dashboard...
        </div>
    )

    if (error) return (
        <div className="text-center py-20 text-red-500 text-xl">
            {error}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-6xl mx-auto">

                <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center">
                    Admin Dashboard 
                </h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    {stats?.totalUsers}
                                </h3>
                            </div>
                            <div className="text-4xl">👥</div>
                        </div>
                    </div>

                    {/* Total Products */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">Total Products</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    {stats?.totalProducts}
                                </h3>
                            </div>
                            <div className="text-4xl">🛍️</div>
                        </div>
                    </div>

                    {/* Total Carts */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">Active Carts</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    {stats?.totalCarts}
                                </h3>
                            </div>
                            <div className="text-4xl">🛒</div>
                        </div>
                    </div>
                </div>

                {/* Products by Category */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Products by Category
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {productsByCategory.map((cat) => (
                            <div
                                key={cat._id}
                                className="bg-pink-50 rounded-lg p-4 text-center"
                            >
                                <p className="text-pink-600 font-bold text-2xl">
                                    {cat.count}
                                </p>
                                <p className="text-gray-600 text-sm capitalize mt-1">
                                    {cat._id}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Users */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Recent Users
                        </h3>
                        <div className="space-y-3">
                            {recentUsers.map((u) => (
                                <div
                                    key={u._id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{u.name}</p>
                                        <p className="text-gray-500 text-sm">{u.email}</p>
                                    </div>
                                    <div className="ml-auto text-gray-400 text-xs">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Recent Products
                        </h3>
                        <div className="space-y-3">
                            {recentProducts.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-pink-50"
                                >
                                    <img
                                        src={product.images?.[0] || 'https://placehold.co/50x50?text=No+Image'}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">{product.name}</p>
                                        <p className="text-pink-600 text-sm font-bold">
                                            Rs. {product.price}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full capitalize">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Quick Actions
                    </h3>
                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={() => navigate('/admin/create-product')}
                            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                        >
                            + Add New Product
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            View All Products
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardPage