import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['shirts', 'pants', 'dresses', 'accessories', 'shoes']
    },
    images: [
        {
            type: String
        }
    ],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;