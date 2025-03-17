const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } = require('@langchain/core/prompts');

// Initialize Groq language model client
const groqLLM = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama3-70b-8192', // Default to LLama3 if not specified
    temperature: 0.5,
});

/**
 * Generate analytics insights from trade data using LLM
 * @param {Array} trades - Array of trade objects
 * @returns {Promise<Object>} Analytics insights
 */
const generateTradingInsights = async (trades) => {
    try {
        // Prepare trade data summary for the LLM
        const tradeSummary = prepareTradeSummary(trades);

        // Create a chat prompt template using the latest method
        const systemTemplate = "You are a professional trading analyst. Analyze the provided trading data and generate insights.";
        const humanTemplate = "Here is my trading data summary: {tradeSummary}. Please provide insights on my trading performance and suggestions for improvement.";

        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemTemplate),
            HumanMessagePromptTemplate.fromTemplate(humanTemplate),
        ]);

        // Format messages with input values
        const formattedPrompt = await chatPrompt.formatMessages({
            tradeSummary: JSON.stringify(tradeSummary)
        });

        // Generate response
        const response = await groqLLM.invoke(formattedPrompt);

        return {
            insights: response.content,
            generatedAt: new Date()
        };
    } catch (error) {
        console.error('Error generating insights with Groq LLM:', error.message);
        throw error;
    }
};

/**
 * Prepare a summary of trades for LLM analysis
 * @param {Array} trades - Array of trade objects
 * @returns {Object} Trade summary
 */
const prepareTradeSummary = (trades) => {
    // Calculate basic metrics
    const winningTrades = trades.filter(trade => trade.isWin);
    const losingTrades = trades.filter(trade => !trade.isWin);

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades * 100).toFixed(2) : 0;

    const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const totalLoss = losingTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);

    const avgDuration = trades.length > 0 ?
        trades.reduce((sum, trade) => sum + trade.duration, 0) / trades.length : 0;

    // Top traded symbols
    const symbolMap = {};
    trades.forEach(trade => {
        if (!symbolMap[trade.symbol]) symbolMap[trade.symbol] = 0;
        symbolMap[trade.symbol]++;
    });

    const topSymbols = Object.entries(symbolMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([symbol, count]) => ({ symbol, count }));

    return {
        totalTrades,
        winRate: `${winRate}%`,
        profitLoss: {
            totalProfit,
            totalLoss,
            netProfit: totalProfit + totalLoss
        },
        avgTradeDuration: `${Math.round(avgDuration)} minutes`,
        topSymbols
    };
};

module.exports = {
    generateTradingInsights
};
