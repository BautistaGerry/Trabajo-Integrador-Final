import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            try { setUser(JSON.parse(savedUser)) }
            catch { logout() }
        }
        setLoading(false)
    }, [])

    async function login(email, password) {
        const res = await api.post('/auth/login', { email, password })
        const { access_token } = res.data
        localStorage.setItem('token', access_token)
        
        const payload = JSON.parse(atob(access_token.split('.')[1]))
        localStorage.setItem('user', JSON.stringify(payload))
        setUser(payload)
        return payload
    }

    async function register(name, email, password) {
        return await api.post('/auth/register', { name, email, password })
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
