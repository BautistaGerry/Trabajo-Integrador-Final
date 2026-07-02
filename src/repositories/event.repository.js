import Event from '../models/event.model.js'

class EventRepository {
    async getAll(filters = {}) {
        const query = { activo: true }
        if (filters.categoria) query.fk_categoria_id = filters.categoria
        if (filters.estado) query.estado = filters.estado
        if (filters.creador) query.fk_creador_id = filters.creador

        return await Event.find(query)
            .populate('fk_categoria_id', 'nombre color')
            .populate('fk_creador_id', 'nombre email')
            .sort({ fecha_inicio: 1 })
    }

    async getById(event_id) {
        return await Event.findOne({ _id: event_id, activo: true })
            .populate('fk_categoria_id', 'nombre color descripcion')
            .populate('fk_creador_id', 'nombre email')
    }

    async create(eventData) {
        return await Event.create(eventData)
    }

    async updateById(event_id, update_data) {
        return await Event.findByIdAndUpdate(event_id, update_data, { new: true })
            .populate('fk_categoria_id', 'nombre color')
            .populate('fk_creador_id', 'nombre email')
    }

    async softDeleteById(event_id) {
        return await Event.findByIdAndUpdate(event_id, { activo: false }, { new: true })
    }

    async deleteById(event_id) {
        return await Event.findByIdAndDelete(event_id)
    }

    async getByCreador(user_id) {
        return await Event.find({ fk_creador_id: user_id, activo: true })
            .populate('fk_categoria_id', 'nombre color')
            .sort({ fecha_inicio: 1 })
    }
}

const eventRepository = new EventRepository()
export default eventRepository
