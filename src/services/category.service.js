import categoryRepository from '../repositories/category.repository.js'
import ServerError from '../helpers/serverError.helper.js'

class CategoryService {
    async getAll(user_id) {
        return await categoryRepository.getAllByUser(user_id)
    }

    async getById(category_id) {
        const category = await categoryRepository.getById(category_id)
        if (!category) {
            throw new ServerError('Categoría no encontrada', 404)
        }
        return category
    }

    async create(nombre, descripcion, color, creador) {
        if (!nombre || nombre.trim().length < 2) {
            throw new ServerError('El nombre de la categoría debe tener al menos 2 caracteres', 400)
        }
        return await categoryRepository.create(nombre.trim(), descripcion || '', color || '#6366f1', creador)
    }

    async update(category_id, update_data, user_id) {
        const category = await categoryRepository.getByIdAndCreador(category_id, user_id)
        if (!category) {
            throw new ServerError('Categoría no encontrada o no tenés permiso para editarla', 403)
        }

        const allowed = {}
        if (update_data.nombre !== undefined) {
            if (update_data.nombre.trim().length < 2) throw new ServerError('El nombre debe tener al menos 2 caracteres', 400)
            allowed.nombre = update_data.nombre.trim()
        }
        if (update_data.descripcion !== undefined) allowed.descripcion = update_data.descripcion
        if (update_data.color !== undefined) allowed.color = update_data.color

        return await categoryRepository.updateById(category_id, allowed)
    }

    async delete(category_id, user_id) {
        const category = await categoryRepository.getByIdAndCreador(category_id, user_id)
        if (!category) {
            throw new ServerError('Categoría no encontrada o no tenés permiso para eliminarla', 403)
        }
        return await categoryRepository.softDeleteById(category_id)
    }
}

const categoryService = new CategoryService()
export default categoryService
