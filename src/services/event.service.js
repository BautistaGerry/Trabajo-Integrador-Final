import eventRepository from '../repositories/event.repository.js'
import categoryRepository from '../repositories/category.repository.js'
import ServerError from '../helpers/serverError.helper.js'
import { EVENT_ESTADOS } from '../models/event.model.js'

class EventService {
    async getAll(filters = {}) {
        return await eventRepository.getAll(filters)
    }

    async getById(event_id) {
        const event = await eventRepository.getById(event_id)
        if (!event) {
            throw new ServerError('Evento no encontrado', 404)
        }
        return event
    }

    async create(eventData, creador_id) {
        const { titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, capacidad_maxima, imagen_url, categoria_id } = eventData

        if (!titulo || titulo.trim().length < 3) {
            throw new ServerError('El título debe tener al menos 3 caracteres', 400)
        }
        if (!fecha_inicio || !fecha_fin) {
            throw new ServerError('Las fechas de inicio y fin son obligatorias', 400)
        }
        const inicio = new Date(fecha_inicio)
        const fin = new Date(fecha_fin)
        if (isNaN(inicio) || isNaN(fin)) {
            throw new ServerError('Fechas inválidas', 400)
        }
        if (fin <= inicio) {
            throw new ServerError('La fecha de fin debe ser posterior a la de inicio', 400)
        }
        if (!categoria_id) {
            throw new ServerError('La categoría es obligatoria', 400)
        }

        const categoria = await categoryRepository.getById(categoria_id)
        if (!categoria) {
            throw new ServerError('Categoría no encontrada', 404)
        }

        return await eventRepository.create({
            titulo: titulo.trim(),
            descripcion: descripcion || '',
            fecha_inicio: inicio,
            fecha_fin: fin,
            ubicacion: ubicacion || '',
            capacidad_maxima: capacidad_maxima || 0,
            imagen_url: imagen_url || '',
            fk_categoria_id: categoria_id,
            fk_creador_id: creador_id
        })
    }

    async update(event_id, update_data, user_id) {
        const event = await eventRepository.getById(event_id)
        if (!event) {
            throw new ServerError('Evento no encontrado', 404)
        }

        if (event.fk_creador_id._id.toString() !== user_id.toString()) {
            throw new ServerError('No tienes permiso para editar este evento', 403)
        }

        const allowed = {}
        if (update_data.titulo !== undefined) {
            if (update_data.titulo.trim().length < 3) throw new ServerError('El título debe tener al menos 3 caracteres', 400)
            allowed.titulo = update_data.titulo.trim()
        }
        if (update_data.descripcion !== undefined) allowed.descripcion = update_data.descripcion
        if (update_data.fecha_inicio !== undefined) allowed.fecha_inicio = new Date(update_data.fecha_inicio)
        if (update_data.fecha_fin !== undefined) allowed.fecha_fin = new Date(update_data.fecha_fin)
        if (update_data.ubicacion !== undefined) allowed.ubicacion = update_data.ubicacion
        if (update_data.capacidad_maxima !== undefined) allowed.capacidad_maxima = update_data.capacidad_maxima
        if (update_data.imagen_url !== undefined) allowed.imagen_url = update_data.imagen_url
        if (update_data.estado !== undefined) {
            if (!Object.values(EVENT_ESTADOS).includes(update_data.estado)) {
                throw new ServerError('Estado inválido', 400)
            }
            allowed.estado = update_data.estado
        }
        if (update_data.categoria_id !== undefined) {
            const categoria = await categoryRepository.getById(update_data.categoria_id)
            if (!categoria) throw new ServerError('Categoría no encontrada', 404)
            allowed.fk_categoria_id = update_data.categoria_id
        }

        const nuevaInicio = allowed.fecha_inicio || event.fecha_inicio
        const nuevaFin = allowed.fecha_fin || event.fecha_fin
        if (nuevaFin <= nuevaInicio) {
            throw new ServerError('La fecha de fin debe ser posterior a la de inicio', 400)
        }

        return await eventRepository.updateById(event_id, allowed)
    }

    async delete(event_id, user_id) {
        const event = await eventRepository.getById(event_id)
        if (!event) {
            throw new ServerError('Evento no encontrado', 404)
        }
        if (event.fk_creador_id._id.toString() !== user_id.toString()) {
            throw new ServerError('No tienes permiso para eliminar este evento', 403)
        }
        return await eventRepository.softDeleteById(event_id)
    }

    async getMisEventos(user_id) {
        return await eventRepository.getByCreador(user_id)
    }
}

const eventService = new EventService()
export default eventService
