const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentsSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    dress_id: { type: Schema.Types.ObjectId, ref: 'dresses', required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: Number, required: true },
    total: { type: Number, required: true, min: 0 },
    rentalDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date, required: true },
    returned: { type: Boolean, default: false },
    recivedBy: { type: String, required: true, ref: 'users', required: false },
}, { timestamps: true });

module.exports = mongoose.model('rents', rentsSchema);
