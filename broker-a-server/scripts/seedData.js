require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Trade = require('../models/trade');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/broker-a-db';

// Sample trade data
const tradeData = [
    {
        tradeId: 'A1001',
        symbol: 'AAPL',
        quantity: 150,
        price: 172.35,
        timestamp: new Date('2023-09-15T10:23:45.000Z')
    },
    {
        tradeId: 'A1002',
        symbol: 'MSFT',
        quantity: 80,
        price: 315.75,
        timestamp: new Date('2023-09-15T11:15:22.000Z')
    },
    {
        tradeId: 'A1003',
        symbol: 'GOOGL',
        quantity: 25,
        price: 140.32,
        timestamp: new Date('2023-09-16T09:45:30.000Z')
    },
    {
        tradeId: 'A1004',
        symbol: 'AMZN',
        quantity: 40,
        price: 136.80,
        timestamp: new Date('2023-09-16T14:22:18.000Z')
    },
    {
        tradeId: 'A1005',
        symbol: 'TSLA',
        quantity: 60,
        price: 243.50,
        timestamp: new Date('2023-09-17T10:05:12.000Z')
    },
    {
        tradeId: 'A1006',
        symbol: 'AAPL',
        quantity: 100,
        price: 173.75,
        timestamp: new Date('2023-09-17T15:34:27.000Z')
    },
    {
        tradeId: 'A1007',
        symbol: 'NVDA',
        quantity: 45,
        price: 425.80,
        timestamp: new Date('2023-09-18T09:12:33.000Z')
    },
    {
        tradeId: 'A1008',
        symbol: 'META',
        quantity: 70,
        price: 305.25,
        timestamp: new Date('2023-09-18T13:45:51.000Z')
    },
    {
        tradeId: 'A1009',
        symbol: 'MSFT',
        quantity: 120,
        price: 318.40,
        timestamp: new Date('2023-09-19T11:02:15.000Z')
    },
    {
        tradeId: 'A1010',
        symbol: 'GOOGL',
        quantity: 55,
        price: 142.70,
        timestamp: new Date('2023-09-19T16:18:42.000Z')
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
const seedDatabase = async () => {
    try {
        // Delete existing data
        await Trade.deleteMany({});
        console.log('Cleared existing trade data');

        // Insert new data
        await Trade.insertMany(tradeData);
        console.log(`Successfully seeded ${tradeData.length} trades`);

        // Close connection
        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Run seed function
seedDatabase();
