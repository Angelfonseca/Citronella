const mongoose = require('mongoose');
const { Schema } = mongoose;

const dressesSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    toSell: { type: Boolean, default: false },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    cleaning: { type: Boolean, default: false },
    category: { type: String, required: true },
    sold: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('dresses', dressesSchema);
