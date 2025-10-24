import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Nombre es obligatorio"]
    },

    price: {
        type: Number,
        default: 0
    },

    available: {
        type: Boolean,
        default: false
    },
    
    description: {
        type: String
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})

export const ProductModel = mongoose.model('Product', productSchema);

