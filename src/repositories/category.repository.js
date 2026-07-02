import Category from '../models/category.model.js'

class CategoryRepository {
    async getAllByUser(user_id) {
        return await Category.find({ activo: true, creador: user_id }).sort({ nombre: 1 })
    }

    async getAllActive() {
        return await Category.find({ activo: true }).sort({ nombre: 1 })
    }

    async getById(category_id) {
        return await Category.findOne({ _id: category_id, activo: true })
    }

    async getByIdAndCreador(category_id, user_id) {
        return await Category.findOne({ _id: category_id, activo: true, creador: user_id })
    }

    async create(nombre, descripcion, color, creador) {
        return await Category.create({ nombre, descripcion, color, creador })
    }

    async updateById(category_id, update_data) {
        return await Category.findByIdAndUpdate(category_id, update_data, { new: true })
    }

    async softDeleteById(category_id) {
        return await Category.findByIdAndUpdate(category_id, { activo: false }, { new: true })
    }

    async deleteById(category_id) {
        return await Category.findByIdAndDelete(category_id)
    }
}

const categoryRepository = new CategoryRepository()
export default categoryRepository
