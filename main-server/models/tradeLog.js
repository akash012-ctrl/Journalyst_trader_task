const mongoose = require('mongoose');

const tradeLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    broker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker'
    },
    // Common unified fields
    tradeId: {
        type: String,
        required: true
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
        required: true
    },
    // Original data
    originalData: {
        type: Object
    },
    // For analytics purposes
    tradeType: {
        type: String,
        enum: ['buy', 'sell']
    },
    profitLoss: {
        type: Number
    },
    isWin: {
        type: Boolean
    },
    duration: {
        type: Number  // Trade duration in minutes
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TradeLog', tradeLogSchema);
