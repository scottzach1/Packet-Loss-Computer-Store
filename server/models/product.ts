// create product schema and model
const productSchema = new Schema({
    name: {
        type:String,
        required:[true, 'Name field is required'],
        unique: true
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    category: {
        type:String,
        required:[true, 'Category field is required']
    },
    subCategory: {
        type:String,
    },
    gender: {
        type: String,
        enum: ['m', 'f'],
        required: [true, 'Gender field must be either m or f']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required']
    },
    stock: {
        type: Array, // should be an array of objects {size: int, count: int}
    },
    cost: {
        type: Number,
        required: [true, 'Cost must be set'],
    },
    description: {
        type:String,
        required:[true, 'Description field is required']
    },
    available: {
        type: Boolean,
        default: true
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    created_at: { type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

const product = mongoose.model('product', productSchema); // create a product model , which would represent a collection in the database

module.exports = product;