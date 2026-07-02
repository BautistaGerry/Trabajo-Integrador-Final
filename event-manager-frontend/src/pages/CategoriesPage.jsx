import { useState, useEffect, useCallback } from 'react'
import api from '../api/api'

function CategoryModal({ initial, onSubmit, onCancel, loading }) {
    const [form, setForm] = useState({ nombre: '', descripcion: '', color: '#6366f1', ...initial })
    const [error, setError] = useState('')

    const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    async function submit(e) {
        e.preventDefault(); setError('')
        try { await onSubmit(form) }
        catch (err) { setError(err?.message || 'Error') }
    }

    return (
        <form onSubmit={submit} id="category-form">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
                <label>Nombre *</label>
                <input name="nombre" className="form-control" value={form.nombre} onChange={handle} required minLength={2} placeholder="Ej: Música, Deporte..." />
            </div>
            <div className="form-group">
                <label>Descripción</label>
                <input name="descripcion" className="form-control" value={form.descripcion} onChange={handle} placeholder="Descripción breve..." />
            </div>
            <div className="form-group">
                <label>Color</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input name="color" type="color" value={form.color} onChange={handle} style={{ width: 48, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
                    <span className="text-muted text-sm">{form.color}</span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
                <button id="submit-cat-form" type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [error, setError] = useState('')

    const fetchCats = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/categories')
            setCategories(res.data.categories || [])
        } catch (err) {
            setError(err?.message || 'Error al cargar categorías')
        } finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchCats() }, [fetchCats])

    function openCreate() { setEditing(null); setShowModal(true) }
    function openEdit(cat) { setEditing(cat); setShowModal(true) }
    function closeModal() { setShowModal(false); setEditing(null) }

    async function handleSubmit(data) {
        setSaving(true)
        try {
            if (editing) await api.put(`/categories/${editing._id}`, data)
            else await api.post('/categories', data)
            closeModal(); fetchCats()
        } catch (err) { throw err } finally { setSaving(false) }
    }

    async function handleDelete(id) {
        if (!window.confirm('¿Eliminar esta categoría?')) return
        try {
            await api.delete(`/categories/${id}`)
            setCategories(cs => cs.filter(c => c._id !== id))
        } catch (err) { alert(err?.message || 'Error al eliminar') }
    }

    return (
        <div>
            <div className="page-hero">
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1>️ Categorías</h1>
                        <p>Administrá las categorías de eventos</p>
                    </div>
                    <button id="create-cat-btn" className="btn btn-primary" onClick={openCreate}>+ Nueva Categoría</button>
                </div>
            </div>

            <div className="container">
                {error && <div className="alert alert-error">{error}</div>}

                {loading
                    ? <div className="loading-center"><div className="spinner" /></div>
                    : categories.length === 0
                        ? <div className="empty-state"><h3>No hay categorías</h3></div>
                        : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                            {categories.map(cat => (
                                <div key={cat._id} className="card" style={{ borderLeft: `4px solid ${cat.color}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                                        <strong>{cat.nombre}</strong>
                                    </div>
                                    {cat.descripcion && <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>{cat.descripcion}</p>}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button id={`edit-cat-${cat._id}`} className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}>Editar</button>
                                        <button id={`delete-cat-${cat._id}`} className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>Borrar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{editing ? 'Editar Categoría' : 'Nueva Categoría'}</span>
                            <button className="modal-close" id="close-cat-modal" onClick={closeModal}>×</button>
                        </div>
                        <CategoryModal initial={editing} onSubmit={handleSubmit} onCancel={closeModal} loading={saving} />
                    </div>
                </div>
            )}
        </div>
    )
}
