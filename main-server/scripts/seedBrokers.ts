import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Broker from '../models/broker';

// Load environment variables
dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trade-analytics-db';

// Sample broker data
const brokerData = [
    {
        name: 'Broker A',
        code: 'brokerA',
        apiEndpoint: 'http://localhost:3001/api/trades/broker-a',
        active: true
    },
    {
        name: 'Broker B',
        code: 'brokerB',
        apiEndpoint: 'http://localhost:3002/api/trades/broker-b',
        active: true
    }
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Seed function
const seedBrokers = async (): Promise<void> => {
    try {
        // Delete existing brokers
        await Broker.deleteMany({});
        console.log('Cleared existing broker data');

        // Insert new brokers
        await Broker.insertMany(brokerData);
        console.log(`Successfully seeded ${brokerData.length} brokers`);

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run seed function
seedBrokers();