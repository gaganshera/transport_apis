let mongoose = require('mongoose');

let OrderModelSchema = new mongoose.Schema(
    {
        distance: Number,
        status: String,
        origin: Array,
        destination: Array,
        createdAt: {type: Date},
        updatedAt: {type: Date, default: Date.now}
    },
    {
        collection: 'orders'
    }
);

module.exports = mongoose.model('OrderModel', OrderModelSchema);