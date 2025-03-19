import express, { Request, Response, NextFunction } from 'express';
import TradeLog, { ITradeLog } from '../models/tradeLog';
import { generateTradingInsights } from '../services/llmService';

const router = express.Router();

interface PerformanceMetrics {
    overall: {
        totalTrades: number;
        winningTrades: number;
        losingTrades: number;
        winRate: string;
        winLossRatio: number;
    };
    financial: {
        totalProfit: string;
        totalLoss: string;
        netProfit: string;
        averageProfit: string;
        averageLoss: string;
    };
    time: {
        averageTradeDuration: string;
        averageWinningTradeDuration: number;
        averageLosingTradeDuration: number;
    };
    symbols: Array<{
        symbol: string;
        trades: number;
        wins: number;
        losses: number;
        totalProfit: number;
        totalLoss: number;
        winRate: string;
        netProfit: string;
    }>;
}

/**
 * GET /api/analytics
 * Generate analytics from trade logs
 */
router.get('/analytics', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Fetch trade logs
        const tradeLogs = await TradeLog.find();

        if (tradeLogs.length === 0) {
            res.status(404).json({ message: 'No trade logs found for analysis' });
            return;
        }

        // Calculate performance metrics
        const metrics = calculatePerformanceMetrics(tradeLogs);

        // Get LLM-generated insights
        const insights = await generateTradingInsights(tradeLogs);

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
 * @param {ITradeLog[]} tradeLogs - Array of trade log objects
 * @returns {PerformanceMetrics} Performance metrics
 */
const calculatePerformanceMetrics = (tradeLogs: ITradeLog[]): PerformanceMetrics => {
    // Calculate win/loss metrics
    const winningTrades = tradeLogs.filter(trade => trade.isWin);
    const losingTrades = tradeLogs.filter(trade => !trade.isWin);

    const winLossRatio = losingTrades.length > 0 ?
        parseFloat((winningTrades.length / losingTrades.length).toFixed(2)) :
        winningTrades.length;

    const winRate = tradeLogs.length > 0 ?
        parseFloat((winningTrades.length / tradeLogs.length * 100).toFixed(2)) : 0;

    // Calculate profit metrics
    const totalProfit = winningTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    const totalLoss = losingTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    const netProfit = totalProfit + totalLoss;

    // Calculate duration metrics
    const avgTradeDuration = tradeLogs.length > 0 ?
        tradeLogs.reduce((sum, trade) => sum + (trade.duration || 0), 0) / tradeLogs.length : 0;

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
                (totalProfit / winningTrades.length).toFixed(2) : "0",
            averageLoss: losingTrades.length > 0 ?
                (totalLoss / losingTrades.length).toFixed(2) : "0"
        },
        time: {
            averageTradeDuration: `${Math.round(avgTradeDuration)} minutes`,
            averageWinningTradeDuration: winningTrades.length > 0 ?
                Math.round(winningTrades.reduce((sum, trade) => sum + (trade.duration || 0), 0) / winningTrades.length) : 0,
            averageLosingTradeDuration: losingTrades.length > 0 ?
                Math.round(losingTrades.reduce((sum, trade) => sum + (trade.duration || 0), 0) / losingTrades.length) : 0
        },
        symbols: symbolPerformance
    };
};

interface SymbolStats {
    symbol: string;
    trades: number;
    wins: number;
    losses: number;
    totalProfit: number;
    totalLoss: number;
    winRate: string;
    netProfit: string;
}

/**
 * Calculate performance metrics by symbol
 * @param {ITradeLog[]} tradeLogs - Array of trade log objects
 * @returns {SymbolStats[]} Symbol performance metrics
 */
const calculateSymbolPerformance = (tradeLogs: ITradeLog[]): SymbolStats[] => {
    // Group trades by symbol
    const symbolMap: Record<string, {
        symbol: string;
        trades: number;
        wins: number;
        losses: number;
        totalProfit: number;
        totalLoss: number;
    }> = {};

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
            symbolStats.totalProfit += trade.profitLoss || 0;
        } else {
            symbolStats.losses++;
            symbolStats.totalLoss += trade.profitLoss || 0;
        }
    });

    // Convert to array and calculate additional metrics
    return Object.values(symbolMap).map(stats => {
        const winRate = stats.trades > 0 ? (stats.wins / stats.trades * 100).toFixed(2) : "0";
        const netProfit = stats.totalProfit + stats.totalLoss;

        return {
            ...stats,
            winRate: `${winRate}%`,
            netProfit: netProfit.toFixed(2)
        };
    }).sort((a, b) => b.trades - a.trades);
};

export default router;