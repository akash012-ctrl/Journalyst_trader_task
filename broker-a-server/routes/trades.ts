import express, { Request, Response, NextFunction } from 'express';
import Trade, { ITrade } from '../models/trade';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Ensure only trades belonging to the authenticated user are fetched
router.get('/broker-a', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const trades = await Trade.find({ userId: req.user?.userId });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// POST a new trade with authentication
router.post('/broker-a', authenticate, async (req: Request, res: Response): Promise<void> => {
    // Add user ID from JWT to associate this trade with the user
    const trade = new Trade({
        tradeId: req.body.tradeId,
        symbol: req.body.symbol,
        quantity: req.body.quantity,
        price: req.body.price,
        timestamp: req.body.timestamp || new Date(),
        userId: req.user?.userId // Add userId from authenticated request
    });

    try {
        const newTrade = await trade.save();
        res.status(201).json(newTrade);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Sample data endpoint for testing - no authentication for easy testing
router.get('/broker-a/sample', (_req: Request, res: Response): void => {
    const sampleData = [
        {
            tradeId: 'A12345',
            symbol: 'AAPL',
            quantity: 100,
            price: 150.75,
            timestamp: new Date().toISOString()
        },
        {
            tradeId: 'A12346',
            symbol: 'MSFT',
            quantity: 50,
            price: 290.50,
            timestamp: new Date().toISOString()
        }
    ];

    res.json(sampleData);
});

export default router;