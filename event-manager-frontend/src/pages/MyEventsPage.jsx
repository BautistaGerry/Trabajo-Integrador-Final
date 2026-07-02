import { useState, useEffect, useCallback } from 'react'
import api from '../api/api'
import EventCard from '../components/EventCard'
import EventForm from '../components/EventForm'

export default function MyEventsPage() {
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchMine = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/events/me/mis-eventos')
            setEvents(res.data.events || [])
        } catch (err) {
            setError(err?.message || 'Error al cargar tus eventos')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.categories || []))
        fetchMine()
    }, [fetchMine])

    function openCreate() { setEditing(null); setShowModal(true) }
    function openEdit(ev) { setEditing(ev); setShowModal(true) }
    function closeModal() { setShowModal(false); setEditing(null) }

    async function handleSubmit(formData) {
        setSaving(true)
        try {
            if (editing) {
                await api.put(`/events/${editing._id}`, formData)
            } else {
                await api.post('/events', formData)
            }
            closeModal()
            fetchMine()
        } catch (err) {
            throw err
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(event_id) {
        if (!window.confirm('¿Eliminar este evento?')) return
        try {
            await api.delete(`/events/${event_id}`)
            setEvents(evs => evs.filter(e => e._id !== event_id))
        } catch (err) {
            alert(err?.message || 'Error al eliminar')
        }
    }

    return (
        <div>
            <div className="page-hero">
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1> Mis Eventos</h1>
                        <p>Gestioná los eventos que creaste</p>
                    </div>
                    <button id="create-event-btn" className="btn btn-primary" onClick={openCreate}>+ Nuevo Evento</button>
                </div>
            </div>

            <div className="container">
                {error && <div className="alert alert-error">{error}</div>}

                {loading
                    ? <div className="loading-center"><div className="spinner" /></div>
                    : events.length === 0
                        ? <div className="empty-state">
                            <h3>Todavía no publicaste ningún evento</h3>
                            <p style={{ marginBottom: '1.5rem' }}>¿Qué esperás?</p>
                            <button className="btn btn-primary" onClick={openCreate}>Crear mi primer evento</button>
                        </div>
                        : <div className="events-grid">
                            {events.map(ev => (
                                <EventCard key={ev._id} event={ev} showActions onEdit={openEdit} onDelete={handleDelete} />
                            ))}
                        </div>
                }
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{editing ? 'Editar Evento' : 'Nuevo Evento'}</span>
                            <button className="modal-close" id="close-event-modal" onClick={closeModal}>×</button>
                        </div>
                        <EventForm
                            initial={editing}
                            categories={categories}
                            onSubmit={handleSubmit}
                            onCancel={closeModal}
                            loading={saving}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
