import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activo: {
        type: Boolean,
        default: true,
        required: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
        required: true
    }
})

export const CATEGORY_COLLECTION_NAME = 'Category'
const Category = mongoose.model(CATEGORY_COLLECTION_NAME, categorySchema)
export default Category
