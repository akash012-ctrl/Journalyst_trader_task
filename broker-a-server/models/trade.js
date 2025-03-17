const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    tradeId: {
        type: String,
        required: true,
        unique: true
    },
    symbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Trade', tradeSchema);
