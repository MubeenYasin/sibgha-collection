
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL  || 'http://localhost:5000/api',
    withCredentials: true
})

// Add access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// If token expired - get new one automatically
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Only retry on 401 AND not on auth routes
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/')
        ) {
            originalRequest._retry = true

            try {
                const res = await axios.post(
                    // 'http://localhost:5000/api/auth/refresh-token',
                    'https://sibgha-collection.onrender.com/api/auth/refresh-token',
                    {},
                    { withCredentials: true }
                )
                const newToken = res.data.accessToken
                localStorage.setItem('accessToken', newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return api(originalRequest)
            } catch{
                localStorage.removeItem('accessToken')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api