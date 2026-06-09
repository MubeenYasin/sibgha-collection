import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const EditProductPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
    })
    const [images, setImages] = useState([])
    const [previews, setPreviews] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`)
            const product = res.data.product
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
            })
            setExistingImages(product.images)
        } catch (err) {
            setError('Failed to load product')
        } finally {
            setFetching(false)
        }
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-xl">Access denied. Admin only!</p>
            </div>
        )
    }

    if (fetching) return (
        <div className="text-center py-20 text-pink-600 text-xl">
            Loading...
        </div>
    )

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setImages(files)
        const previewUrls = files.map(file => URL.createObjectURL(file))
        setPreviews(previewUrls)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('description', formData.description)
            data.append('price', formData.price)
            data.append('category', formData.category)
            data.append('stock', formData.stock)

            images.forEach(image => {
                data.append('images', image)
            })

            await api.put(`/products/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setSuccess('Product updated successfully!')
            setTimeout(() => navigate(`/products/${id}`), 1500)

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else {
                setError('Failed to update product')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">

                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
                    Edit Product
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Price (Rs.)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                            required
                        >
                            <option value="">Select category</option>
                            <option value="shirts">Shirts</option>
                            <option value="pants">Pants</option>
                            <option value="dresses">Dresses</option>
                            <option value="accessories">Accessories</option>
                            <option value="shoes">Shoes</option>
                        </select>
                    </div>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Current Images</label>
                            <div className="flex gap-2 flex-wrap">
                                {existingImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`existing-${index}`}
                                        className="w-24 h-24 object-cover rounded border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">
                            Upload New Images (replaces existing)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                        />

                        {previews.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {previews.map((preview, index) => (
                                    <img
                                        key={index}
                                        src={preview}
                                        alt={`preview-${index}`}
                                        className="w-24 h-24 object-cover rounded border border-pink-400"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/products/${id}`)}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default EditProductPage