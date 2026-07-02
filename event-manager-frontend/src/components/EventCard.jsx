import { Link } from 'react-router-dom'

const EMOJIS = ['', '', '', '', '', '', '', '']

export default function EventCard({ event, onDelete, onEdit, showActions }) {
    const dateStr = event.fecha_inicio
        ? new Date(event.fecha_inicio).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—'
    const endStr = event.fecha_fin
        ? new Date(event.fecha_fin).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
        : '—'
    const emoji = EMOJIS[event._id?.charCodeAt(0) % EMOJIS.length] || ''
    const catColor = event.fk_categoria_id?.color || 'var(--color-primary)'

    const badgeCls = {
        activo: 'badge-active',
        cancelado: 'badge-canceled',
        finalizado: 'badge-finished'
    }[event.estado] || 'badge-active'

    return (
        <div className="event-card">
            {event.imagen_url
                ? <img src={event.imagen_url} alt={event.titulo} className="event-card-img" />
                : <div className="event-card-img-placeholder">{emoji}</div>
            }
            <div className="event-card-body">
                {event.fk_categoria_id && (
                    <div className="event-card-category" style={{ color: catColor }}>
                        {event.fk_categoria_id.nombre}
                    </div>
                )}
                <h3 className="event-card-title">{event.titulo}</h3>
                <div className="event-card-meta">
                    <span> {dateStr} → {endStr}</span>
                    {event.ubicacion && <span> {event.ubicacion}</span>}
                    {event.capacidad_maxima > 0 && <span> {event.capacidad_maxima} lugares</span>}
                    {event.fk_creador_id && <span>️ {event.fk_creador_id.nombre}</span>}
                </div>
                <div className="event-card-footer">
                    <span className={`badge ${badgeCls}`}>{event.estado}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {showActions && (
                            <>
                                <button id={`edit-event-${event._id}`} className="btn btn-ghost btn-sm" onClick={() => onEdit(event)}>Editar</button>
                                <button id={`delete-event-${event._id}`} className="btn btn-danger btn-sm" onClick={() => onDelete(event._id)}>Borrar</button>
                            </>
                        )}
                        <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm" id={`view-event-${event._id}`}>Ver</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
