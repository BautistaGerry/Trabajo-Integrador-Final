import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err.response?.data || { message: 'Error de red', ok: false })
)

export default api
