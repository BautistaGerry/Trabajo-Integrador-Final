import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(form.email, form.password)
            navigate('/')
        } catch (err) {
            setError(err?.message || 'Credenciales inválidas')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">¡Bienvenido! </h1>
                <p className="auth-subtitle">Ingresá a tu cuenta para gestionar eventos</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} id="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input id="password" name="password" type="password" className="form-control" value={form.password} onChange={handleChange} placeholder="••••••••" required />
                    </div>
                    <p className="text-muted text-sm" style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.83rem' }}>¿Olvidaste tu contraseña?</Link>
                    </p>
                    <button id="login-btn" type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <p className="text-muted text-sm mt-2" style={{ textAlign: 'center' }}>
                    ¿No tenés cuenta?&nbsp;
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Registrate</Link>
                </p>
            </div>
        </div>
    )
}
