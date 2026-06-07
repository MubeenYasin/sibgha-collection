import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth()

    // Wait for auth to load
    if (loading) {
        return (
            <div className="text-center py-20 text-pink-600 text-xl">
                Loading...
            </div>
        )
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Admin only route but user is not admin
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute