const express = require('express');
const router = express.Router();
const brokerService = require('../services/brokerService');
const TradeLog = require('../models/tradeLog');
const { transformAllTrades, calculateTradeMetrics } = require('../services/dataTransformationService');

/**
 * GET /api/trade-logs
 * Fetch trade logs from all brokers and return in unified format
 */
router.get('/trade-logs', async (req, res, next) => {
    try {
        const allTrades = await brokerService.fetchAllBrokerTrades();
        res.json(allTrades);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/trade-logs/sync
 * Fetch and store trade logs from brokers
 */
router.post('/trade-logs/sync', async (req, res, next) => {
    try {
        // Fetch trades from brokers
        const allTrades = await brokerService.fetchAllBrokerTrades();

        // Transform to unified format
        const transformedTrades = transformAllTrades(allTrades);

        // Add metrics
        const tradesWithMetrics = calculateTradeMetrics(transformedTrades);

        // Save to database (simplified for this example)
        const savedTrades = [];
        for (const trade of tradesWithMetrics) {
            // Check if trade already exists
            const existingTrade = await TradeLog.findOne({
                tradeId: trade.tradeId,
                brokerType: trade.brokerType
            });

            if (!existingTrade) {
                const newTrade = new TradeLog(trade);
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
router.get('/trade-logs/stored', async (req, res, next) => {
    try {
        const tradeLogs = await TradeLog.find()
            .populate('broker')
            .populate('user', '-password');

        res.json(tradeLogs);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
