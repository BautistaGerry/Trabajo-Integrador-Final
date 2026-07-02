import express from 'express'
import categoryController from '../controllers/category.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const categoryRouter = express.Router()

categoryRouter.get('/', authMiddleware, categoryController.getAll.bind(categoryController))
categoryRouter.get('/:id', authMiddleware, categoryController.getById.bind(categoryController))

categoryRouter.post('/', authMiddleware, categoryController.create.bind(categoryController))
categoryRouter.put('/:id', authMiddleware, categoryController.update.bind(categoryController))
categoryRouter.delete('/:id', authMiddleware, categoryController.delete.bind(categoryController))

export default categoryRouter
