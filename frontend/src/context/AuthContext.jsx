import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
        try {
            setUser(JSON.parse(savedUser))
        } catch{
            localStorage.removeItem('user')
        }
    }
    setLoading(false)
}, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        setUser(res.data.user)
        return res.data
    }

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password })
        return res.data
    }

    const logout = async () => {
        await api.post('/auth/logout')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)