import express, { Request, Response, NextFunction } from 'express';
import { fetchAllBrokerTrades } from '../services/brokerService';
import TradeLog, { ITradeLog } from '../models/tradeLog';
import { transformAllTrades, calculateTradeMetrics, TransformedTrade } from '../services/dataTransformationService';
import { authenticate } from '../middlewares/authMiddleware';
import Broker from '../models/broker';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/trade-logs
 * Fetch trade logs from user's registered brokers and return in unified format
 * Requires authentication
 */
router.get('/trade-logs', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }

        // Only fetch data from brokers the user has access to
        const allTrades = await fetchAllBrokerTrades(req.user.userId, req.user.brokers);
        res.json(allTrades);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/trade-logs/sync
 * Fetch and store trades from user's authorized brokers
 * Requires authentication
 */
router.post('/trade-logs/sync', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }

        // Fetch trades from brokers user has access to
        const allTrades = await fetchAllBrokerTrades(req.user.userId, req.user.brokers);

        // Transform to unified format
        const transformedTrades = transformAllTrades(allTrades);

        // Add metrics
        const tradesWithMetrics = calculateTradeMetrics(transformedTrades);

        // Get broker IDs for this user
        const brokers = await Broker.find({ code: { $in: req.user.brokers } });
        const brokerIdMap = new Map(brokers.map(broker => [broker.code, broker._id]));

        // Save to database (simplified for this example)
        const savedTrades: ITradeLog[] = [];

        for (const trade of tradesWithMetrics) {
            // Determine broker ID
            const brokerId = brokerIdMap.get(trade.brokerType);

            if (!brokerId) {
                console.warn(`No broker found for type: ${trade.brokerType}`);
                continue;
            }

            // Check if trade already exists for this user
            const existingTrade = await TradeLog.findOne({
                tradeId: trade.id,
                brokerType: trade.brokerType,
                user: new mongoose.Types.ObjectId(req.user.userId)
            });

            if (!existingTrade) {
                const newTrade = new TradeLog({
                    user: req.user.userId,
                    broker: brokerId,
                    tradeId: trade.id,
                    symbol: trade.symbol,
                    quantity: trade.quantity,
                    price: trade.price,
                    timestamp: trade.timestamp,
                    originalData: trade.originalData,
                    tradeType: trade.tradeType,
                    profitLoss: trade.profitLoss,
                    isWin: trade.isWin,
                    duration: trade.duration
                });

                const savedTrade = await newTrade.save();
                savedTrades.push(savedTrade);
            }
        }

        res.json({
            message: `Synced ${savedTrades.length} new trades for user ${req.user.username}`,
            totalTradesFetched: transformedTrades.length
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/trade-logs/stored
 * Get all stored trade logs for the authenticated user
 * Requires authentication
 */
router.get('/trade-logs/stored', authenticate, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User authentication required' });
            return;
        }

        const tradeLogs = await TradeLog.find({ user: req.user.userId })
            .populate('broker')
            .populate('user', '-password');

        res.json(tradeLogs);
    } catch (error) {
        next(error);
    }
});

export default router;