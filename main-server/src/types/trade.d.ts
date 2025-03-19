// Broker A trade format
export interface BrokerATrade {
  tradeId: string;
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string | Date;
  _id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Broker B trade format
export interface BrokerBTrade {
  orderId: string;
  asset: string;
  amount: number;
  cost: number;
  executedAt: string | Date;
  _id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Combined response from all brokers
export interface TradeLogsResponse {
  brokerA: BrokerATrade[];
  brokerB: BrokerBTrade[];
}

// Unified trade data format used internally
export interface UnifiedTradeData {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  timestamp: Date;
  originalData: any;
  brokerId: string;
}

// Types for authentication
export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
}

// Analytics response types
export interface PerformanceMetric {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: string;
  winLossRatio: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  averageProfit: number;
  averageLoss: number;
}

export interface SymbolMetric {
  symbol: string;
  trades: number;
  wins: number;
  losses: number;
  totalProfit: number;
  totalLoss: number;
  winRate: string;
  netProfit: number;
}

export interface AnalyticsResponse {
  metrics: {
    overall: PerformanceMetric;
    symbols: SymbolMetric[];
  };
  insights: string;
  generatedAt: Date;
}

// API error response
export interface ApiError {
  message: string;
  status: number;
  error?: any;
}

// Database schema types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Broker {
  id: string;
  name: string;
  apiEndpoint: string;
}

export interface TradeLogs {
  id: string;
  userId: string;
  brokerId: string;
  tradeData: UnifiedTradeData;
  createdAt: Date;
}
