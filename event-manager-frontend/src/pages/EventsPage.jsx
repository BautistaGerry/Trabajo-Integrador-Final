import { useState, useEffect } from 'react'
import api from '../api/api'
import EventCard from '../components/EventCard'

export default function EventsPage() {
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filterCat, setFilterCat] = useState('')
    const [filterEstado, setFilterEstado] = useState('')

    async function fetchEvents() {
        setLoading(true)
        try {
            const params = {}
            if (filterCat) params.categoria = filterCat
            if (filterEstado) params.estado = filterEstado
            const res = await api.get('/events', { params })
            setEvents(res.data.events || [])
        } catch (err) {
            setError(err?.message || 'Error al cargar eventos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.categories || []))
    }, [])

    useEffect(() => { fetchEvents() }, [filterCat, filterEstado])

    return (
        <div>
            <div className="page-hero">
                <div className="container">
                    <h1> Eventos</h1>
                    <p>Explorá todos los eventos disponibles</p>
                </div>
            </div>

            <div className="container">
                <div className="filters-bar">
                    <select id="filter-category" className="form-control" style={{ width: 'auto', minWidth: 180 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
                    </select>
                    <select id="filter-status" className="form-control" style={{ width: 'auto', minWidth: 150 }} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
                        <option value="">Todos los estados</option>
                        <option value="activo">Activo</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                    <button id="clear-filters" className="btn btn-ghost btn-sm" onClick={() => { setFilterCat(''); setFilterEstado('') }}>Limpiar</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading
                    ? <div className="loading-center"><div className="spinner" /></div>
                    : events.length === 0
                        ? <div className="empty-state"><h3>No hay eventos disponibles</h3><p>Volvé más tarde o cambiá los filtros</p></div>
                        : <div className="events-grid">
                            {events.map(ev => <EventCard key={ev._id} event={ev} />)}
                        </div>
                }
            </div>
        </div>
    )
}
