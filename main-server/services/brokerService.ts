import axios, { AxiosResponse } from 'axios';
import { BrokerATrade, BrokerBTrade, TradeLogsResponse } from '../src/types/trade';

// Configure broker API endpoints
const BROKER_A_ENDPOINT = process.env.BROKER_A_API || 'http://localhost:3001/api/trades/broker-a';
const BROKER_B_ENDPOINT = process.env.BROKER_B_API || 'http://localhost:3002/api/trades/broker-b';

/**
 * Fetches trade data from Broker A
 * @param userId User ID for authentication
 * @param token JWT token for authentication
 * @returns {Promise<BrokerATrade[]>} Array of trade objects
 */
const fetchBrokerATrades = async (userId: string, token: string): Promise<BrokerATrade[]> => {
    try {
        const response: AxiosResponse<BrokerATrade[]> = await axios.get(BROKER_A_ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Broker A:', (error as Error).message);
        return [];  // Return empty array instead of throwing to handle broker unavailability gracefully
    }
};

/**
 * Fetches trade data from Broker B
 * @param userId User ID for authentication
 * @param token JWT token for authentication
 * @returns {Promise<BrokerBTrade[]>} Array of order objects
 */
const fetchBrokerBTrades = async (userId: string, token: string): Promise<BrokerBTrade[]> => {
    try {
        const response: AxiosResponse<BrokerBTrade[]> = await axios.get(BROKER_B_ENDPOINT, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Broker B:', (error as Error).message);
        return [];  // Return empty array instead of throwing to handle broker unavailability gracefully
    }
};

/**
 * Fetches trade data from all brokers that the user has access to
 * @param userId User ID for authentication
 * @param brokerCodes Array of broker codes that the user has access to
 * @returns {Promise<TradeLogsResponse>} Object containing trade data from user's brokers
 */
const fetchAllBrokerTrades = async (userId: string, brokerCodes: string[]): Promise<TradeLogsResponse> => {
    try {
        // Get JWT token from main server (we'll use the same JWT across all servers for simplicity)
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ userId, brokers: brokerCodes }, JWT_SECRET, { expiresIn: '1h' });

        // Initialize empty response
        const response: TradeLogsResponse = {
            brokerA: [],
            brokerB: []
        };

        // Only fetch from brokers the user has access to
        const promises = [];

        if (brokerCodes.includes('brokerA')) {
            promises.push(
                fetchBrokerATrades(userId, token)
                    .then(data => { response.brokerA = data; })
                    .catch(() => { response.brokerA = []; })
            );
        }

        if (brokerCodes.includes('brokerB')) {
            promises.push(
                fetchBrokerBTrades(userId, token)
                    .then(data => { response.brokerB = data; })
                    .catch(() => { response.brokerB = []; })
            );
        }

        // Wait for all broker requests to complete
        await Promise.all(promises);

        return response;
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