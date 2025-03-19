import express, { Request, Response, NextFunction } from 'express';
import { fetchAllBrokerTrades } from '../services/brokerService';
import TradeLog, { ITradeLog } from '../models/tradeLog';
import { transformAllTrades, calculateTradeMetrics, TransformedTrade } from '../services/dataTransformationService';

const router = express.Router();

/**
 * GET /api/trade-logs
 * Fetch trade logs from all brokers and return in unified format
 */
router.get('/trade-logs', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allTrades = await fetchAllBrokerTrades();
        res.json(allTrades);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/trade-logs/sync
 * Fetch and store trade logs from brokers
 */
router.post('/trade-logs/sync', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Fetch trades from brokers
        const allTrades = await fetchAllBrokerTrades();

        // Transform to unified format
        const transformedTrades = transformAllTrades(allTrades);

        // Add metrics
        const tradesWithMetrics = calculateTradeMetrics(transformedTrades);

        // Save to database (simplified for this example)
        const savedTrades: ITradeLog[] = [];

        for (const trade of tradesWithMetrics) {
            // Check if trade already exists
            const existingTrade = await TradeLog.findOne({
                tradeId: trade.id,
                brokerType: trade.brokerType
            });

            if (!existingTrade) {
                const newTrade = new TradeLog({
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
            message: `Synced ${savedTrades.length} new trades`,
            totalTradesFetched: transformedTrades.length
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/trade-logs/stored
 * Get all stored trade logs from database
 */
router.get('/trade-logs/stored', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tradeLogs = await TradeLog.find()
            .populate('broker')
            .populate('user', '-password');

        res.json(tradeLogs);
    } catch (error) {
        next(error);
    }
});

export default router;