import { z } from 'zod';
import { BrokerATrade, BrokerBTrade, UnifiedTradeData } from '../types/trade';
import { isBrokerATrade, isBrokerBTrade } from './typeGuards';

// Broker A trade schema
export const brokerATradeSchema = z.object({
  tradeId: z.string(),
  symbol: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  timestamp: z.string().datetime()
});

// Broker B trade schema
export const brokerBTradeSchema = z.object({
  orderId: z.string(),
  asset: z.string(),
  amount: z.number().positive(),
  cost: z.number().positive(),
  executedAt: z.string().datetime()
});

// Analytics request schema
export const analyticsRequestSchema = z.object({
  userId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  brokerIds: z.array(z.string()).optional()
});

/**
 * Validates and sanitizes trade data from Broker A
 * @param trade The trade data to validate
 * @returns Valid trade data or throws an error
 */
export function validateBrokerATrade(trade: unknown): BrokerATrade {
  if (!isBrokerATrade(trade)) {
    throw new Error('Invalid Broker A trade data');
  }

  // Sanitize and validate data
  return {
    tradeId: trade.tradeId.trim(),
    symbol: trade.symbol.trim().toUpperCase(),
    quantity: Math.abs(trade.quantity),
    price: parseFloat(trade.price.toFixed(2)),
    timestamp: trade.timestamp instanceof Date ? trade.timestamp : new Date(trade.timestamp),
    ...(trade._id && { _id: trade._id }),
    ...(trade.createdAt && { createdAt: trade.createdAt }),
    ...(trade.updatedAt && { updatedAt: trade.updatedAt })
  };
}

/**
 * Validates and sanitizes trade data from Broker B
 * @param trade The trade data to validate
 * @returns Valid trade data or throws an error
 */
export function validateBrokerBTrade(trade: unknown): BrokerBTrade {
  if (!isBrokerBTrade(trade)) {
    throw new Error('Invalid Broker B trade data');
  }

  // Sanitize and validate data
  return {
    orderId: trade.orderId.trim(),
    asset: trade.asset.trim().toUpperCase(),
    amount: Math.abs(trade.amount),
    cost: parseFloat(trade.cost.toFixed(2)),
    executedAt: trade.executedAt instanceof Date ? trade.executedAt : new Date(trade.executedAt),
    ...(trade._id && { _id: trade._id }),
    ...(trade.createdAt && { createdAt: trade.createdAt }),
    ...(trade.updatedAt && { updatedAt: trade.updatedAt })
  };
}

/**
 * Validates a unified trade data object
 * @param trade The unified trade data to validate
 * @returns True if the trade data is valid
 */
export function validateUnifiedTradeData(trade: UnifiedTradeData): boolean {
  // Required fields must be present
  if (!trade.id || !trade.symbol || !trade.quantity || !trade.price || !trade.timestamp) {
    return false;
  }

  // Validate numeric fields
  if (isNaN(trade.quantity) || isNaN(trade.price) || trade.quantity <= 0 || trade.price <= 0) {
    return false;
  }

  // Validate symbol format
  if (typeof trade.symbol !== 'string' || trade.symbol.trim() === '') {
    return false;
  }

  // Validate timestamp is a valid date
  if (!(trade.timestamp instanceof Date) || isNaN(trade.timestamp.getTime())) {
    return false;
  }

  // Validate broker ID exists
  if (!trade.brokerId || typeof trade.brokerId !== 'string' || trade.brokerId.trim() === '') {
    return false;
  }

  return true;
}

/**
 * Validates trade data before saving to database
 * @param tradeData Object containing trade data
 * @returns Validated and normalized trade data
 */
export function normalizeTradeData(tradeData: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};

  // Normalize common fields
  if ('symbol' in tradeData) {
    normalized.symbol = String(tradeData.symbol).trim().toUpperCase();
  }

  if ('quantity' in tradeData || 'amount' in tradeData) {
    normalized.quantity = Math.abs(Number(tradeData.quantity || tradeData.amount));
  }

  if ('price' in tradeData || 'cost' in tradeData) {
    normalized.price = parseFloat(Number(tradeData.price || tradeData.cost).toFixed(2));
  }

  if ('timestamp' in tradeData || 'executedAt' in tradeData || 'date' in tradeData) {
    const dateInput = tradeData.timestamp || tradeData.executedAt || tradeData.date;
    normalized.timestamp = dateInput instanceof Date ? dateInput : new Date(dateInput);
  }

  return normalized;
}