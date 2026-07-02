import express from 'express'
import eventController from '../controllers/event.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const eventRouter = express.Router()

eventRouter.get('/', eventController.getAll.bind(eventController))
eventRouter.get('/:id', eventController.getById.bind(eventController))

eventRouter.post('/', authMiddleware, eventController.create.bind(eventController))
eventRouter.put('/:id', authMiddleware, eventController.update.bind(eventController))
eventRouter.delete('/:id', authMiddleware, eventController.delete.bind(eventController))
eventRouter.get('/me/mis-eventos', authMiddleware, eventController.getMisEventos.bind(eventController))

export default eventRouter
