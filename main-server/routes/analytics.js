const express = require('express');
const router = express.Router();
const TradeLog = require('../models/tradeLog');
const llmService = require('../services/llmService');

/**
 * GET /api/analytics
 * Generate analytics from trade logs
 */
router.get('/analytics', async (req, res, next) => {
    try {
        // Fetch trade logs
        const tradeLogs = await TradeLog.find();

        if (tradeLogs.length === 0) {
            return res.status(404).json({ message: 'No trade logs found for analysis' });
        }

        // Calculate performance metrics
        const metrics = calculatePerformanceMetrics(tradeLogs);

        // Get LLM-generated insights
        const insights = await llmService.generateTradingInsights(tradeLogs);

        res.json({
            metrics,
            insights: insights.insights,
            generatedAt: insights.generatedAt
        });
    } catch (error) {
        next(error);
    }
});

/**
 * Calculate performance metrics from trade logs
 * @param {Array} tradeLogs - Array of trade log objects
 * @returns {Object} Performance metrics
 */
const calculatePerformanceMetrics = (tradeLogs) => {
    // Calculate win/loss metrics
    const winningTrades = tradeLogs.filter(trade => trade.isWin);
    const losingTrades = tradeLogs.filter(trade => !trade.isWin);

    const winLossRatio = losingTrades.length > 0 ?
        (winningTrades.length / losingTrades.length).toFixed(2) :
        winningTrades.length;

    const winRate = tradeLogs.length > 0 ?
        (winningTrades.length / tradeLogs.length * 100).toFixed(2) : 0;

    // Calculate profit metrics
    const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const totalLoss = losingTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const netProfit = totalProfit + totalLoss;

    // Calculate duration metrics
    const avgTradeDuration = tradeLogs.length > 0 ?
        tradeLogs.reduce((sum, trade) => sum + trade.duration, 0) / tradeLogs.length : 0;

    // Calculate metrics by symbol
    const symbolPerformance = calculateSymbolPerformance(tradeLogs);

    return {
        overall: {
            totalTrades: tradeLogs.length,
            winningTrades: winningTrades.length,
            losingTrades: losingTrades.length,
            winRate: `${winRate}%`,
            winLossRatio,
        },
        financial: {
            totalProfit: totalProfit.toFixed(2),
            totalLoss: totalLoss.toFixed(2),
            netProfit: netProfit.toFixed(2),
            averageProfit: winningTrades.length > 0 ?
                (totalProfit / winningTrades.length).toFixed(2) : 0,
            averageLoss: losingTrades.length > 0 ?
                (totalLoss / losingTrades.length).toFixed(2) : 0
        },
        time: {
            averageTradeDuration: `${Math.round(avgTradeDuration)} minutes`,
            averageWinningTradeDuration: winningTrades.length > 0 ?
                Math.round(winningTrades.reduce((sum, trade) => sum + trade.duration, 0) / winningTrades.length) : 0,
            averageLosingTradeDuration: losingTrades.length > 0 ?
                Math.round(losingTrades.reduce((sum, trade) => sum + trade.duration, 0) / losingTrades.length) : 0
        },
        symbols: symbolPerformance
    };
};

/**
 * Calculate performance metrics by symbol
 * @param {Array} tradeLogs - Array of trade log objects
 * @returns {Array} Symbol performance metrics
 */
const calculateSymbolPerformance = (tradeLogs) => {
    // Group trades by symbol
    const symbolMap = {};

    tradeLogs.forEach(trade => {
        if (!symbolMap[trade.symbol]) {
            symbolMap[trade.symbol] = {
                symbol: trade.symbol,
                trades: 0,
                wins: 0,
                losses: 0,
                totalProfit: 0,
                totalLoss: 0
            };
        }

        const symbolStats = symbolMap[trade.symbol];
        symbolStats.trades++;

        if (trade.isWin) {
            symbolStats.wins++;
            symbolStats.totalProfit += trade.profitLoss;
        } else {
            symbolStats.losses++;
            symbolStats.totalLoss += trade.profitLoss;
        }
    });

    // Convert to array and calculate additional metrics
    return Object.values(symbolMap).map(stats => {
        const winRate = stats.trades > 0 ? (stats.wins / stats.trades * 100).toFixed(2) : 0;
        const netProfit = stats.totalProfit + stats.totalLoss;

        return {
            ...stats,
            winRate: `${winRate}%`,
            netProfit: netProfit.toFixed(2)
        };
    }).sort((a, b) => b.trades - a.trades);
};

module.exports = router;
