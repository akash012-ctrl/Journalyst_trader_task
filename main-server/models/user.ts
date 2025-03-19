import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    brokers: Types.ObjectId[];
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    brokers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Broker'
    }]
});

export default mongoose.model<IUser>('User', userSchema);