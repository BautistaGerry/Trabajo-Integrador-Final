import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            const res = await api.post('/auth/forgot-password', { email })
            setSuccess(res.message || 'Revisá tu casilla de correo para restablecer tu contraseña')
        } catch (err) {
            setError(err?.message || 'No se pudo enviar el correo de recuperación')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">🔑 Recuperar contraseña</h1>
                <p className="auth-subtitle">Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {!success && (
                    <form onSubmit={handleSubmit} id="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="forgot-email">Email</label>
                            <input
                                id="forgot-email"
                                name="email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>
                        <button id="forgot-btn" type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </button>
                    </form>
                )}

                <p className="text-muted text-sm mt-2" style={{ textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>← Volver al login</Link>
                </p>
            </div>
        </div>
    )
}
