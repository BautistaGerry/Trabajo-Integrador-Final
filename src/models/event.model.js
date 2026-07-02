import mongoose from 'mongoose'
import { CATEGORY_COLLECTION_NAME } from './category.model.js'
import { USER_COLLECTION_NAME } from './user.model.js'

export const EVENT_ESTADOS = {
    ACTIVO: 'activo',
    CANCELADO: 'cancelado',
    FINALIZADO: 'finalizado'
}

const eventSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_fin: {
        type: Date,
        required: true
    },
    ubicacion: {
        type: String,
        default: ''
    },
    capacidad_maxima: {
        type: Number,
        default: 0          
    },
    estado: {
        type: String,
        enum: [EVENT_ESTADOS.ACTIVO, EVENT_ESTADOS.CANCELADO, EVENT_ESTADOS.FINALIZADO],
        default: EVENT_ESTADOS.ACTIVO
    },
    imagen_url: {
        type: String,
        default: ''
    },
    
    fk_categoria_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CATEGORY_COLLECTION_NAME,
        required: true
    },
    
    fk_creador_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
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

export const EVENT_COLLECTION_NAME = 'Event'
const Event = mongoose.model(EVENT_COLLECTION_NAME, eventSchema)
export default Event
