import mongoose, { Document, Schema } from 'mongoose';

// Define interface for the document
export interface IOrder extends Document {
    orderId: string;
    asset: string;
    amount: number;
    cost: number;
    executedAt: Date;
    userId: string; // Added userId field
}

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    asset: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    executedAt: {
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

export default mongoose.model<IOrder>('Order', orderSchema);