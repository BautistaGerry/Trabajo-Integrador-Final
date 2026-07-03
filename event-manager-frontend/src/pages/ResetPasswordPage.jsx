import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/api'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''
    const id = searchParams.get('id') || ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }
        if (!token || !id) {
            setError('Enlace inválido. Solicitá un nuevo enlace de recuperación.')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/reset-password', {
                token,
                id,
                new_password: password
            })
            setSuccess(res.message || '¡Contraseña restablecida con éxito! Ya podés iniciar sesión.')
        } catch (err) {
            setError(err?.message || 'No se pudo restablecer la contraseña. El enlace pudo haber expirado.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">🔒 Nueva contraseña</h1>
                <p className="auth-subtitle">Ingresá tu nueva contraseña</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {!success ? (
                    <form onSubmit={handleSubmit} id="reset-password-form">
                        <div className="form-group">
                            <label htmlFor="new-password">Nueva contraseña</label>
                            <input
                                id="new-password"
                                name="password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirmar contraseña</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <button id="reset-btn" type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                        </button>
                    </form>
                ) : (
                    <p className="text-muted text-sm mt-2" style={{ textAlign: 'center' }}>
                        <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
                            Ir al login
                        </Link>
                    </p>
                )}

                {!success && (
                    <p className="text-muted text-sm mt-2" style={{ textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>← Volver al login</Link>
                    </p>
                )}
            </div>
        </div>
    )
}
