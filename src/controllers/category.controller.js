import categoryService from '../services/category.service.js'
import ServerError from '../helpers/serverError.helper.js'

class CategoryController {
    async getAll(req, res) {
        try {
            const user_id = req.user.id
            const categories = await categoryService.getAll(user_id)
            return res.status(200).json({ ok: true, status: 200, data: { categories } })
        } catch (error) {
            return CategoryController._handleError(res, error)
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params
            const category = await categoryService.getById(id)
            return res.status(200).json({ ok: true, status: 200, data: { category } })
        } catch (error) {
            return CategoryController._handleError(res, error)
        }
    }

    async create(req, res) {
        try {
            const { nombre, descripcion, color } = req.body
            const creador = req.user.id
            const category = await categoryService.create(nombre, descripcion, color, creador)
            return res.status(201).json({ ok: true, status: 201, data: { category } })
        } catch (error) {
            return CategoryController._handleError(res, error)
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const user_id = req.user.id
            const category = await categoryService.update(id, req.body, user_id)
            return res.status(200).json({ ok: true, status: 200, data: { category } })
        } catch (error) {
            return CategoryController._handleError(res, error)
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params
            const user_id = req.user.id
            await categoryService.delete(id, user_id)
            return res.status(200).json({ ok: true, status: 200, message: 'Categoría eliminada correctamente' })
        } catch (error) {
            return CategoryController._handleError(res, error)
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

const categoryController = new CategoryController()
export default categoryController
