import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            await register(form.name, form.email, form.password)
            setSuccess('¡Registro exitoso! Revisá tu email para verificar tu cuenta antes de iniciar sesión.')
            setTimeout(() => navigate('/login'), 4000)
        } catch (err) {
            setError(err?.message || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Crear cuenta </h1>
                <p className="auth-subtitle">Unite a EventHub y empezá a publicar eventos</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} id="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre completo</label>
                        <input id="name" name="name" className="form-control" value={form.name} onChange={handleChange} placeholder="Tu nombre" required minLength={3} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email</label>
                        <input id="reg-email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Contraseña</label>
                        <input id="reg-password" name="password" type="password" className="form-control" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required minLength={6} />
                    </div>
                    <button id="register-btn" type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="text-muted text-sm mt-2" style={{ textAlign: 'center' }}>
                    ¿Ya tenés cuenta?&nbsp;
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Ingresar</Link>
                </p>
            </div>
        </div>
    )
}
