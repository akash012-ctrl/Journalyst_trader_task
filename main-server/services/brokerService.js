const axios = require('axios');

// Configure broker API endpoints
const BROKER_A_ENDPOINT = process.env.BROKER_A_API || 'http://localhost:3001/api/trades/broker-a';
const BROKER_B_ENDPOINT = process.env.BROKER_B_API || 'http://localhost:3002/api/trades/broker-b';

/**
 * Fetches trade data from Broker A
 * @returns {Promise<Array>} Array of trade objects
 */
const fetchBrokerATrades = async () => {
    try {
        const response = await axios.get(BROKER_A_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Broker A:', error.message);
        throw error;
    }
};

/**
 * Fetches trade data from Broker B
 * @returns {Promise<Array>} Array of order objects
 */
const fetchBrokerBTrades = async () => {
    try {
        const response = await axios.get(BROKER_B_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Broker B:', error.message);
        throw error;
    }
};

/**
 * Fetches trade data from all brokers
 * @returns {Promise<Object>} Object containing trade data from all brokers
 */
const fetchAllBrokerTrades = async () => {
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
        console.error('Error fetching data from all brokers:', error.message);
        throw error;
    }
};

module.exports = {
    fetchBrokerATrades,
    fetchBrokerBTrades,
    fetchAllBrokerTrades
};
