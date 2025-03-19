import express, { Request, Response } from 'express';
import Order, { IOrder } from '../models/order';

const router = express.Router();

// GET all trades from Broker B
router.get('/broker-b', async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// POST a new order
router.post('/broker-b', async (req: Request, res: Response): Promise<void> => {
    const order = new Order({
        orderId: req.body.orderId,
        asset: req.body.asset,
        amount: req.body.amount,
        cost: req.body.cost,
        executedAt: req.body.executedAt || new Date()
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Sample data endpoint for testing
router.get('/broker-b/sample', (_req: Request, res: Response): void => {
    const sampleData = [
        {
            orderId: 'B54321',
            asset: 'BTC',
            amount: 2.5,
            cost: 45000.75,
            executedAt: new Date().toISOString()
        },
        {
            orderId: 'B54322',
            asset: 'ETH',
            amount: 10,
            cost: 2500.30,
            executedAt: new Date().toISOString()
        }
    ];

    res.json(sampleData);
});

export default router;