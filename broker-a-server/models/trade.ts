import mongoose, { Document, Schema } from 'mongoose';

// Define interface for the document
export interface ITrade extends Document {
    tradeId: string;
    symbol: string;
    quantity: number;
    price: number;
    timestamp: Date;
    userId: string; // Added userId field
}

const tradeSchema = new Schema({
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
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<ITrade>('Trade', tradeSchema);