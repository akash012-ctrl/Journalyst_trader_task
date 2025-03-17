/**
 * Transforms Broker A trade data to unified schema
 * @param {Object} trade - Trade data from Broker A
 * @returns {Object} Unified trade data
 */
const transformBrokerATrade = (trade) => {
    return {
        tradeId: trade.tradeId,
        symbol: trade.symbol,
        quantity: trade.quantity,
        price: trade.price,
        timestamp: new Date(trade.timestamp),
        originalData: { ...trade },
        brokerType: 'brokerA'
    };
};

/**
 * Transforms Broker B trade data to unified schema
 * @param {Object} order - Order data from Broker B
 * @returns {Object} Unified trade data
 */
const transformBrokerBTrade = (order) => {
    return {
        tradeId: order.orderId,
        symbol: order.asset,
        quantity: order.amount,
        price: order.cost,
        timestamp: new Date(order.executedAt),
        originalData: { ...order },
        brokerType: 'brokerB'
    };
};


/**
 * Transforms all broker data to unified schema
 * @param {Object} allTrades - Object containing trade data from all brokers
 * @returns {Array} Array of unified trade objects
 */
const transformAllTrades = (allTrades) => {
    const transformedBrokerA = allTrades.brokerA.map(transformBrokerATrade);
    const transformedBrokerB = allTrades.brokerB.map(transformBrokerBTrade);

    return [...transformedBrokerA, ...transformedBrokerB];
};

/**
 * Calculate additional metrics for trades
 * @param {Array} trades - Array of unified trade objects
 * @returns {Array} Trades with additional metrics
 */
const calculateTradeMetrics = (trades) => {
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

module.exports = {
    transformBrokerATrade,
    transformBrokerBTrade,
    transformAllTrades,
    calculateTradeMetrics
};
