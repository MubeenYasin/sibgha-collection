import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const StarRating = ({ rating, onRate, interactive = false }) => {
    const [hovered, setHovered] = useState(0)

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => interactive && onRate(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={`text-2xl ${interactive ? 'cursor-pointer' : ''} 
                        ${star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingReview, setEditingReview] = useState(null)
    const [formData, setFormData] = useState({ rating: 0, comment: '' })
    const [submitting, setSubmitting] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${productId}`)
            setReviews(res.data.reviews)
            setAverageRating(res.data.averageRating)
        } catch (error) {
            console.log('Reviews error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.rating === 0) {
            toast.error('Please select a rating!')
            return
        }

        setSubmitting(true)
        try {
            if (editingReview) {
                await api.put(`/reviews/${editingReview._id}`, formData)
                toast.success('Review updated!')
            } else {
                await api.post(`/reviews/${productId}`, formData)
                toast.success('Review added!')
            }
            setFormData({ rating: 0, comment: '' })
            setShowForm(false)
            setEditingReview(null)
            fetchReviews()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (review) => {
        setEditingReview(review)
        setFormData({ rating: review.rating, comment: review.comment })
        setShowForm(true)
    }

    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm('Delete this review?')
        if (!confirmed) return

        try {
            await api.delete(`/reviews/${reviewId}`)
            toast.success('Review deleted!')
            fetchReviews()
        } catch{
            toast.error('Failed to delete review')
        }
    }

    const userReview = reviews.find(r => r.user._id === user?._id)

    if (loading) return (
        <div className="text-center py-4 text-pink-600">
            Loading reviews...
        </div>
    )

    return (
        <div className="mt-8">
            <hr className="mb-6" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                        Customer Reviews
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="text-gray-600">
                            {averageRating} out of 5 ({reviews.length} reviews)
                        </span>
                    </div>
                </div>

                {/* Write Review Button */}
                {user && user.role !== 'admin' && !userReview && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                    >
                        Write Review
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-gray-800 mb-4">
                        {editingReview ? 'Edit Review' : 'Write a Review'}
                    </h4>
                    <form onSubmit={handleSubmit}>

                        {/* Star Rating */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Rating</label>
                            <StarRating
                                rating={formData.rating}
                                onRate={(r) => setFormData({ ...formData, rating: r })}
                                interactive={true}
                            />
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Comment</label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                                rows="3"
                                placeholder="Share your experience..."
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : editingReview ? 'Update' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditingReview(null)
                                    setFormData({ rating: 0, comment: '' })
                                }}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to review!
                </p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                        {review.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">
                                            {review.user.name}
                                        </p>
                                        <StarRating rating={review.rating} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <p className="text-gray-400 text-sm">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>

                                    {/* Edit/Delete for own review */}
                                    {user && user._id === review.user._id && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(review)}
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="text-red-500 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-600 mt-3 ml-13">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewSection