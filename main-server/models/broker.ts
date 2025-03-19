import mongoose, { Document, Schema } from 'mongoose';

export interface IBroker extends Document {
    name: string;
    code: 'brokerA' | 'brokerB';
    apiEndpoint: string;
    active: boolean;
    createdAt: Date;
}

const brokerSchema = new Schema({
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

export default mongoose.model<IBroker>('Broker', brokerSchema);