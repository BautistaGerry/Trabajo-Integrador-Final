import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function EventDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data.event))
            .catch(err => setError(err?.message || 'Error al cargar el evento'))
            .finally(() => setLoading(false))
    }, [id])

    async function handleDelete() {
        if (!window.confirm('¿Estás seguro de eliminar este evento?')) return
        try {
            await api.delete(`/events/${id}`)
            navigate('/my-events')
        } catch (err) {
            alert(err?.message || 'Error al eliminar')
        }
    }

    if (loading) return <div className="loading-center"><div className="spinner" /></div>
    if (error) return <div className="container mt-3"><div className="alert alert-error">{error}</div></div>
    if (!event) return null

    const isOwner = user && event.fk_creador_id?._id === user.id
    const startDate = new Date(event.fecha_inicio).toLocaleString('es-AR', { dateStyle: 'full', timeStyle: 'short' })
    const endDate = new Date(event.fecha_fin).toLocaleString('es-AR', { dateStyle: 'full', timeStyle: 'short' })
    const badgeCls = { activo: 'badge-active', cancelado: 'badge-canceled', finalizado: 'badge-finished' }[event.estado]

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 780 }}>
            <Link to="/" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>← Volver</Link>

            {event.imagen_url
                ? <img src={event.imagen_url} alt={event.titulo} className="detail-hero" style={{ marginBottom: '1.5rem' }} />
                : <div className="detail-hero-placeholder"></div>
            }

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    {event.fk_categoria_id && (
                        <span style={{ color: event.fk_categoria_id.color, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {event.fk_categoria_id.nombre}
                        </span>
                    )}
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.4rem', lineHeight: 1.2 }}>{event.titulo}</h1>
                </div>
                <span className={`badge ${badgeCls}`} style={{ fontSize: '0.85rem' }}>{event.estado}</span>
            </div>

            <div className="detail-meta">
                <span> Inicio: {startDate}</span>
                <span> Fin: {endDate}</span>
                {event.ubicacion && <span> {event.ubicacion}</span>}
                {event.capacidad_maxima > 0 && <span> Capacidad: {event.capacidad_maxima}</span>}
                {event.fk_creador_id && <span>️ Organiza: {event.fk_creador_id.nombre}</span>}
            </div>

            {event.descripcion && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <h2 className="section-title">Descripción</h2>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>{event.descripcion}</p>
                </div>
            )}

            {isOwner && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                    <Link to={`/my-events`} className="btn btn-ghost">← Mis Eventos</Link>
                    <button id="delete-event-detail" className="btn btn-danger" onClick={handleDelete}>Eliminar Evento</button>
                </div>
            )}
        </div>
    )
}
