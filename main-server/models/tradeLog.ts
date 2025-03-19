import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITradeLog extends Document {
    user: Types.ObjectId;
    broker: Types.ObjectId;
    tradeId: string;
    symbol: string;
    quantity: number;
    price: number;
    timestamp: Date;
    originalData: object;
    tradeType?: 'buy' | 'sell';
    profitLoss?: number;
    isWin?: boolean;
    duration?: number;
}

const tradeLogSchema = new Schema({
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

export default mongoose.model<ITradeLog>('TradeLog', tradeLogSchema);