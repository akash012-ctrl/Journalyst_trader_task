import express, { Request, Response, NextFunction } from 'express';
import Order, { IOrder } from '../models/order';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Ensure only orders belonging to the authenticated user are fetched
router.get('/broker-b', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ userId: req.user?.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// POST a new order with authentication
router.post('/broker-b', authenticate, async (req: Request, res: Response): Promise<void> => {
    const order = new Order({
        orderId: req.body.orderId,
        asset: req.body.asset,
        amount: req.body.amount,
        cost: req.body.cost,
        executedAt: req.body.executedAt || new Date(),
        userId: req.user?.userId // Add userId from authenticated request
    });

    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Sample data endpoint for testing - no authentication for easy testing
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