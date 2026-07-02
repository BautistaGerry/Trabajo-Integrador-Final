import eventService from '../services/event.service.js'
import ServerError from '../helpers/serverError.helper.js'

class EventController {
    async getAll(req, res) {
        try {
            const { categoria, estado } = req.query
            const filters = {}
            if (categoria) filters.categoria = categoria
            if (estado) filters.estado = estado

            const events = await eventService.getAll(filters)
            return res.status(200).json({ ok: true, status: 200, data: { events } })
        } catch (error) {
            return EventController._handleError(res, error)
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            const event = await eventService.getById(id)
            return res.status(200).json({ ok: true, status: 200, data: { event } })
        } catch (error) {
            return EventController._handleError(res, error)
        }
    }

    async create(req, res) {
        try {
            const user_id = req.user.id
            const event = await eventService.create(req.body, user_id)
            return res.status(201).json({ ok: true, status: 201, data: { event } })
        } catch (error) {
            return EventController._handleError(res, error)
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const user_id = req.user.id
            const event = await eventService.update(id, req.body, user_id)
            return res.status(200).json({ ok: true, status: 200, data: { event } })
        } catch (error) {
            return EventController._handleError(res, error)
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params
            const user_id = req.user.id
            await eventService.delete(id, user_id)
            return res.status(200).json({ ok: true, status: 200, message: 'Evento eliminado correctamente' })
        } catch (error) {
            return EventController._handleError(res, error)
        }
    }

    async getMisEventos(req, res) {
        try {
            const user_id = req.user.id
            const events = await eventService.getMisEventos(user_id)
            return res.status(200).json({ ok: true, status: 200, data: { events } })
        } catch (error) {
            return EventController._handleError(res, error)
        }
    }

    static _handleError(res, error) {
        if (error instanceof ServerError) {
            return res.status(error.status).json({ ok: false, status: error.status, message: error.message })
        }
        console.error('Error crítico:', error)
        return res.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' })
    }
}

const eventController = new EventController()
export default eventController
