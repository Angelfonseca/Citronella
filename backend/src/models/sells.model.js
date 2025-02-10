const mongoose = require('mongoose');
const { Schema } = mongoose;
const sellsSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    products: [
        {
            product_id: { type: Schema.Types.ObjectId, refPath: 'products.product_model', required: true },
            product_model: { type: String, enum: ['dresses', 'jewelry'], required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 },
        },
    ],
    total: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('sells', sellsSchema);
