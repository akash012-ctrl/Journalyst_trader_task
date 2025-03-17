const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        enum: ['brokerA', 'brokerB']
    },
    apiEndpoint: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Broker', brokerSchema);
