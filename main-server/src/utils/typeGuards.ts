import { BrokerATrade, BrokerBTrade } from '../types/trade';

/**
 * Type guard to verify if an object is a valid Broker A Trade
 * @param obj The object to check
 * @returns True if the object matches the BrokerATrade interface
 */
export function isBrokerATrade(obj: any): obj is BrokerATrade {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.tradeId === 'string' &&
    typeof obj.symbol === 'string' &&
    typeof obj.quantity === 'number' &&
    typeof obj.price === 'number' &&
    (typeof obj.timestamp === 'string' || obj.timestamp instanceof Date)
  );
}

/**
 * Type guard to verify if an object is a valid Broker B Trade
 * @param obj The object to check
 * @returns True if the object matches the BrokerBTrade interface
 */
export function isBrokerBTrade(obj: any): obj is BrokerBTrade {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.orderId === 'string' &&
    typeof obj.asset === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.cost === 'number' &&
    (typeof obj.executedAt === 'string' || obj.executedAt instanceof Date)
  );
}

/**
 * Type guard to verify if an array contains valid Broker A Trade objects
 * @param arr The array to check
 * @returns True if all objects in the array match the BrokerATrade interface
 */
export function isBrokerATradeArray(arr: any[]): arr is BrokerATrade[] {
  return Array.isArray(arr) && arr.every(item => isBrokerATrade(item));
}

/**
 * Type guard to verify if an array contains valid Broker B Trade objects
 * @param arr The array to check
 * @returns True if all objects in the array match the BrokerBTrade interface
 */
export function isBrokerBTradeArray(arr: any[]): arr is BrokerBTrade[] {
  return Array.isArray(arr) && arr.every(item => isBrokerBTrade(item));
}

/**
 * Ensures all required properties exist in a trade object
 * @param trade The trade object to validate
 * @param requiredProps Array of required property names
 * @returns True if all required properties exist
 */
export function hasRequiredTradeProperties<T extends object>(trade: T, requiredProps: (keyof T)[]): boolean {
  return requiredProps.every(prop => prop in trade && trade[prop] !== null && trade[prop] !== undefined);
}

export function validateTradeData<T>(data: unknown, validator: (item: unknown) => item is T): T[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array of trade data');
  }

  const validData: T[] = [];

  for (const item of data) {
    if (validator(item)) {
      validData.push(item);
    } else {
      console.warn('Invalid trade data found:', item);
    }
  }

  return validData;
}