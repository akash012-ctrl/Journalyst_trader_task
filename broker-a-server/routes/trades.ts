import express, { Request, Response } from 'express';
import Trade, { ITrade } from '../models/trade';

const router = express.Router();

// GET all trades from Broker A
router.get('/broker-a', async (req: Request, res: Response): Promise<void> => {
    try {
        const trades = await Trade.find();
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// POST a new trade
router.post('/broker-a', async (req: Request, res: Response): Promise<void> => {
    const trade = new Trade({
        tradeId: req.body.tradeId,
        symbol: req.body.symbol,
        quantity: req.body.quantity,
        price: req.body.price,
        timestamp: req.body.timestamp || new Date()
    });

    try {
        const newTrade = await trade.save();
        res.status(201).json(newTrade);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

// Sample data endpoint for testing
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