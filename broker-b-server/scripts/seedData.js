require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Order = require('../models/order');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/broker-b-db';

// Sample order data
const orderData = [
    {
        orderId: 'B2001',
        asset: 'BTC',
        amount: 1.25,
        cost: 41250.75,
        executedAt: new Date('2023-09-15T09:30:15.000Z')
    },
    {
        orderId: 'B2002',
        asset: 'ETH',
        amount: 8.5,
        cost: 2295.40,
        executedAt: new Date('2023-09-15T12:45:33.000Z')
    },
    {
        orderId: 'B2003',
        asset: 'SOL',
        amount: 45,
        cost: 108.25,
        executedAt: new Date('2023-09-16T08:15:22.000Z')
    },
    {
        orderId: 'B2004',
        asset: 'ADA',
        amount: 1500,
        cost: 0.45,
        executedAt: new Date('2023-09-16T15:10:45.000Z')
    },
    {
        orderId: 'B2005',
        asset: 'BTC',
        amount: 0.75,
        cost: 42300.80,
        executedAt: new Date('2023-09-17T11:23:18.000Z')
    },
    {
        orderId: 'B2006',
        asset: 'DOT',
        amount: 120,
        cost: 5.75,
        executedAt: new Date('2023-09-17T14:40:27.000Z')
    },
    {
        orderId: 'B2007',
        asset: 'ETH',
        amount: 4.2,
        cost: 2320.15,
        executedAt: new Date('2023-09-18T10:05:55.000Z')
    },
    {
        orderId: 'B2008',
        asset: 'AVAX',
        amount: 35,
        cost: 28.40,
        executedAt: new Date('2023-09-18T16:35:12.000Z')
    },
    {
        orderId: 'B2009',
        asset: 'SOL',
        amount: 65,
        cost: 112.80,
        executedAt: new Date('2023-09-19T09:50:33.000Z')
    },
    {
        orderId: 'B2010',
        asset: 'BTC',
        amount: 2.1,
        cost: 41800.25,
        executedAt: new Date('2023-09-19T15:25:47.000Z')
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
        await Order.deleteMany({});
        console.log('Cleared existing order data');

        // Insert new data
        await Order.insertMany(orderData);
        console.log(`Successfully seeded ${orderData.length} orders`);

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
