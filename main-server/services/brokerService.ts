import axios, { AxiosResponse } from 'axios';
import { BrokerATrade, BrokerBTrade, TradeLogsResponse } from '../src/types/trade';

// Configure broker API endpoints
const BROKER_A_ENDPOINT = process.env.BROKER_A_API || 'http://localhost:3001/api/trades/broker-a';
const BROKER_B_ENDPOINT = process.env.BROKER_B_API || 'http://localhost:3002/api/trades/broker-b';

/**
 * Fetches trade data from Broker A
 * @returns {Promise<BrokerATrade[]>} Array of trade objects
 */
const fetchBrokerATrades = async (): Promise<BrokerATrade[]> => {
    try {
        const response: AxiosResponse<BrokerATrade[]> = await axios.get(BROKER_A_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Broker A:', (error as Error).message);
        throw error;
    }
};

/**
 * Fetches trade data from Broker B
 * @returns {Promise<BrokerBTrade[]>} Array of order objects
 */
const fetchBrokerBTrades = async (): Promise<BrokerBTrade[]> => {
    try {
        const response: AxiosResponse<BrokerBTrade[]> = await axios.get(BROKER_B_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Broker B:', (error as Error).message);
        throw error;
    }
};

/**
 * Fetches trade data from all brokers
 * @returns {Promise<TradeLogsResponse>} Object containing trade data from all brokers
 */
const fetchAllBrokerTrades = async (): Promise<TradeLogsResponse> => {
    try {
        const [brokerATrades, brokerBTrades] = await Promise.all([
            fetchBrokerATrades(),
            fetchBrokerBTrades()
        ]);

        return {
            brokerA: brokerATrades,
            brokerB: brokerBTrades
        };
    } catch (error) {
        console.error('Error fetching data from all brokers:', (error as Error).message);
        throw error;
    }
};

export {
    fetchBrokerATrades,
    fetchBrokerBTrades,
    fetchAllBrokerTrades
};