import { useState, useEffect } from 'react'
import api from '../api/api'

export default function EventForm({ initial, categories, onSubmit, onCancel, loading }) {
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        ubicacion: '',
        capacidad_maxima: '',
        imagen_url: '',
        categoria_id: '',
        estado: 'activo',
        ...initial
    })
    const [error, setError] = useState('')

    useEffect(() => {
        if (initial) {
            setForm({
                titulo: initial.titulo || '',
                descripcion: initial.descripcion || '',
                fecha_inicio: initial.fecha_inicio ? initial.fecha_inicio.slice(0, 16) : '',
                fecha_fin: initial.fecha_fin ? initial.fecha_fin.slice(0, 16) : '',
                ubicacion: initial.ubicacion || '',
                capacidad_maxima: initial.capacidad_maxima || '',
                imagen_url: initial.imagen_url || '',
                categoria_id: initial.fk_categoria_id?._id || initial.categoria_id || '',
                estado: initial.estado || 'activo'
            })
        }
    }, [initial])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            await onSubmit(form)
        } catch (err) {
            setError(err?.message || 'Error al guardar el evento')
        }
    }

    return (
        <form onSubmit={handleSubmit} id="event-form">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input id="titulo" name="titulo" className="form-control" value={form.titulo} onChange={handleChange} placeholder="Nombre del evento" required />
            </div>

            <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" className="form-control" rows={3} value={form.descripcion} onChange={handleChange} placeholder="Descripción del evento..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label htmlFor="fecha_inicio">Fecha inicio *</label>
                    <input id="fecha_inicio" name="fecha_inicio" type="datetime-local" className="form-control" value={form.fecha_inicio} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="fecha_fin">Fecha fin *</label>
                    <input id="fecha_fin" name="fecha_fin" type="datetime-local" className="form-control" value={form.fecha_fin} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="ubicacion">Ubicación</label>
                <input id="ubicacion" name="ubicacion" className="form-control" value={form.ubicacion} onChange={handleChange} placeholder="Ciudad, dirección..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label htmlFor="capacidad_maxima">Capacidad (0 = sin límite)</label>
                    <input id="capacidad_maxima" name="capacidad_maxima" type="number" min={0} className="form-control" value={form.capacidad_maxima} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select id="estado" name="estado" className="form-control" value={form.estado} onChange={handleChange}>
                        <option value="activo">Activo</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="categoria_id">Categoría *</label>
                <select id="categoria_id" name="categoria_id" className="form-control" value={form.categoria_id} onChange={handleChange} required>
                    <option value="">— Seleccionar —</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="imagen_url">URL de imagen (opcional)</label>
                <input id="imagen_url" name="imagen_url" className="form-control" value={form.imagen_url} onChange={handleChange} placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button id="submit-event-form" type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Evento'}
                </button>
            </div>
        </form>
    )
}
