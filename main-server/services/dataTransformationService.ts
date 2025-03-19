import { BrokerATrade, BrokerBTrade, TradeLogsResponse, UnifiedTradeData } from '../src/types/trade';

interface TransformedTrade extends UnifiedTradeData {
    brokerType: 'brokerA' | 'brokerB';
    tradeType?: 'buy' | 'sell';
    profitLoss?: number;
    isWin?: boolean;
    duration?: number;
}

/**
 * Transforms Broker A trade data to unified schema
 * @param {BrokerATrade} trade - Trade data from Broker A
 * @returns {TransformedTrade} Unified trade data
 */
const transformBrokerATrade = (trade: BrokerATrade): TransformedTrade => {
    return {
        id: trade.tradeId,
        symbol: trade.symbol,
        quantity: trade.quantity,
        price: trade.price,
        timestamp: new Date(trade.timestamp),
        originalData: { ...trade },
        brokerType: 'brokerA',
        brokerId: 'brokerA' // This would be replaced with actual broker ID in real implementation
    };
};

/**
 * Transforms Broker B trade data to unified schema
 * @param {BrokerBTrade} order - Order data from Broker B
 * @returns {TransformedTrade} Unified trade data
 */
const transformBrokerBTrade = (order: BrokerBTrade): TransformedTrade => {
    return {
        id: order.orderId,
        symbol: order.asset,
        quantity: order.amount,
        price: order.cost,
        timestamp: new Date(order.executedAt),
        originalData: { ...order },
        brokerType: 'brokerB',
        brokerId: 'brokerB' // This would be replaced with actual broker ID in real implementation
    };
};

/**
 * Transforms all broker data to unified schema
 * @param {TradeLogsResponse} allTrades - Object containing trade data from all brokers
 * @returns {TransformedTrade[]} Array of unified trade objects
 */
const transformAllTrades = (allTrades: TradeLogsResponse): TransformedTrade[] => {
    const transformedBrokerA = allTrades.brokerA.map(transformBrokerATrade);
    const transformedBrokerB = allTrades.brokerB.map(transformBrokerBTrade);

    return [...transformedBrokerA, ...transformedBrokerB];
};

/**
 * Calculate additional metrics for trades
 * @param {TransformedTrade[]} trades - Array of unified trade objects
 * @returns {TransformedTrade[]} Trades with additional metrics
 */
const calculateTradeMetrics = (trades: TransformedTrade[]): TransformedTrade[] => {
    // This is a simplified implementation
    // In a real system, you would need more data to determine buy/sell and profit/loss

    return trades.map(trade => {
        // Mock implementation - in reality, you'd need to match buys with sells
        const isWin = Math.random() > 0.5;
        return {
            ...trade,
            tradeType: Math.random() > 0.5 ? 'buy' : 'sell',
            profitLoss: isWin ? Math.random() * 500 : -Math.random() * 500,
            isWin,
            duration: Math.floor(Math.random() * 60 * 24) // Random duration up to 24 hours in minutes
        };
    });
};

export {
    transformBrokerATrade,
    transformBrokerBTrade,
    transformAllTrades,
    calculateTradeMetrics,
    type TransformedTrade
};