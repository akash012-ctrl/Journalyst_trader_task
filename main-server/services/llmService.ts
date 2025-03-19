import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';
import { ITradeLog } from '../models/tradeLog';

// Initialize Groq language model client
const groqLLM = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY || '',
    modelName: process.env.GROQ_MODEL || 'llama3-70b-8192', // Default to LLama3 if not specified
    temperature: 0.5,
});

interface TradeSummary {
    totalTrades: number;
    winRate: string;
    profitLoss: {
        totalProfit: number;
        totalLoss: number;
        netProfit: number;
    };
    avgTradeDuration: string;
    topSymbols: Array<{
        symbol: string;
        count: number;
    }>;
}

interface InsightsResponse {
    insights: string;
    generatedAt: Date;
}

/**
 * Generate analytics insights from trade data using LLM
 * @param {ITradeLog[]} trades - Array of trade objects
 * @returns {Promise<InsightsResponse>} Analytics insights
 */
const generateTradingInsights = async (trades: ITradeLog[]): Promise<InsightsResponse> => {
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
            insights: response.content.toString(),
            generatedAt: new Date()
        };
    } catch (error) {
        console.error('Error generating insights with Groq LLM:', (error as Error).message);
        throw error;
    }
};

/**
 * Prepare a summary of trades for LLM analysis
 * @param {ITradeLog[]} trades - Array of trade objects
 * @returns {TradeSummary} Trade summary
 */
const prepareTradeSummary = (trades: ITradeLog[]): TradeSummary => {
    // Calculate basic metrics
    const winningTrades = trades.filter(trade => trade.isWin);
    const losingTrades = trades.filter(trade => !trade.isWin);

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades * 100).toFixed(2) : '0';

    const totalProfit = winningTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    const totalLoss = losingTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);

    const avgDuration = trades.length > 0 ?
        trades.reduce((sum, trade) => sum + (trade.duration || 0), 0) / trades.length : 0;

    // Top traded symbols
    const symbolMap: Record<string, number> = {};
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

export {
    generateTradingInsights,
    type InsightsResponse,
    type TradeSummary
};