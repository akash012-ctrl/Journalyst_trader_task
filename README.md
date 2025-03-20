# Trade Analytics Platform

A comprehensive platform that integrates with multiple broker APIs, processes trade data, and provides analytics and insights using LLM technology.

## Project Architecture

```
Trade Analytics Platform
│
├── Broker A Server (Port 3001)
│   ├── API Endpoints
│   │   └── /api/trades/broker-a
│   └── MongoDB: broker-a-db
│
├── Broker B Server (Port 3002)
│   ├── API Endpoints
│   │   └── /api/trades/broker-b
│   └── MongoDB: broker-b-db
│
└── Main Platform Server (Port 3000)
    ├── API Endpoints
    │   ├── /api/trade-logs
    │   └── /api/analytics
    ├── MongoDB: trade-analytics-db
    └── OpenAI Integration
```

## Server Descriptions

### 1. Broker A Server

- Simulates a broker API providing trade data
- Stores data in a MongoDB collection
- Data Schema: `{ tradeId, symbol, quantity, price, timestamp }`
- Implemented in TypeScript with type safety

### 2. Broker B Server

- Simulates a different broker API with a different data format
- Stores data in a MongoDB collection
- Data Schema: `{ orderId, asset, amount, cost, executedAt }`
- Implemented in TypeScript with type safety

### 3. Main Platform Server

- Central server that integrates data from both brokers
- Performs data transformation to a unified schema
- Provides analytics using performance calculations and LLM insights
- Maintains a relational database with user profiles, broker connections, and trade logs
- Implements type validation and guards for broker-specific data formats

## Recent Updates

### TypeScript Migration

The platform has been migrated from JavaScript to TypeScript to enhance type safety and developer experience. Key improvements include:

- Type definitions for broker-specific data formats
- Type guards for runtime validation of incoming data
- TypeScript interfaces for database models
- Strong typing for API requests and responses
- See [MIGRATION.md](./MIGRATION.md) for detailed information about the migration process

### Architecture Improvements

- Enhanced data validation with TypeScript-based middleware
- Improved type safety across all server components
- Better IDE support and code documentation through TypeScript

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- GROQ API key (for LLM integration)
- TypeScript (v4.5 or higher)

### Installation Steps

1. Clone the repository:

```bash
git clone <repository-url>
cd trade-analytics-platform
```

2. Set up each server:

**Broker A Server:**

```bash
cd broker-a-server
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

**Broker B Server:**

```bash
cd broker-b-server
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

**Main Server:**

```bash
cd main-server
npm install
cp .env.example .env  # Configure your environment variables
# Important: Add your OpenAI API key to .env file
npm run dev
```

3. All three servers should be running concurrently.

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "firstName": "string (optional)",
    "lastName": "string (optional)",
    "brokerCodes": ["brokerA", "brokerB"]
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Broker A Server (Protected Routes)

- `GET /api/trades/broker-a` - Get all trades from Broker A (requires authentication)
- `POST /api/trades/broker-a` - Add a new trade to Broker A (requires authentication)
- `GET /api/trades/broker-a/sample` - Get sample trade data for testing (public)

### Broker B Server (Protected Routes)

- `GET /api/trades/broker-b` - Get all orders from Broker B (requires authentication)
- `POST /api/trades/broker-b` - Add a new order to Broker B (requires authentication)
- `GET /api/trades/broker-b/sample` - Get sample order data for testing (public)

### Main Platform Server (Protected Routes)

- `GET /api/trade-logs` - Fetch all trade logs from user's authorized brokers
- `POST /api/trade-logs/sync` - Sync trades from user's authorized brokers
- `GET /api/trade-logs/stored` - Get all stored trade logs for the authenticated user
- `GET /api/analytics` - Get performance metrics and AI-generated insights for user's trades

## Database Schema

### Main Server Database

1. **User Profile**

   - Username, email, password
   - Links to broker accounts

2. **Broker**

   - Name, code (brokerA, brokerB)
   - API endpoint
   - Active status

3. **Trade Logs**
   - References to User and Broker
   - Unified trade data (symbol, quantity, price)
   - Original broker-specific data
   - Analytics fields (profit/loss, win/loss, duration)

## Type Definitions

The platform includes comprehensive TypeScript definitions:

### Broker A Trade Type
```typescript
interface BrokerATrade {
  tradeId: string;
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string;
}
```

### Broker B Trade Type
```typescript
interface BrokerBTrade {
  orderId: string;
  asset: string;
  amount: number;
  cost: number;
  executedAt: string;
}
```

### Unified Response Type
```typescript
interface UnifiedTradeResponse {
  brokerA: BrokerATrade[];
  brokerB: BrokerBTrade[];
}
```

## Data Flow

1. **Data Collection:**

   - Main server fetches data from Broker A and Broker B servers
   - Raw data is kept in original format for reference

2. **Data Transformation:**

   - Broker-specific formats are transformed into a unified schema
   - Additional metrics are calculated (profit/loss, trade duration)

3. **Data Storage:**

   - Transformed data is stored in the trade logs collection
   - Relations to users and brokers are established

4. **Analytics Generation:**

   - Performance metrics are calculated from stored trade data
   - Trade summary is sent to OpenAI API for insights generation

5. **Insights Delivery:**
   - Combined metrics and LLM-generated insights are returned to the user

## Development Workflow

1. Start all three servers in development mode:
   ```bash
   # For TypeScript development
   npm run dev
   
   # For production (after building)
   npm run build
   npm start
   ```
2. Use the sample data endpoints to populate with initial test data
3. Use `/api/trade-logs/sync` to fetch and store trade data
4. Access analytics through the `/api/analytics` endpoint

## Error Handling

The platform implements centralized error handling with:

- Custom middleware for consistent error responses
- Appropriate HTTP status codes
- Detailed error logging
- Environment-specific error information (development vs. production)
- Type-safe error handling with TypeScript

## Security Considerations

- JWT-based authentication implemented across all servers
- Users can only access trades from brokers they are registered with
- Tokens include user ID and authorized broker list
- API endpoints require proper authentication token in Authorization header
- Token validation ensures user has access to requested broker
- Sensitive data like passwords are properly hashed using bcrypt
- API keys are stored as environment variables
- Data validation is implemented for all inputs
- TypeScript validation enhances runtime data safety

## Authentication Flow

1. **User Registration:**
   - User registers with username, email, password, and broker access
   - Password is hashed using bcrypt
   - User is stored in main server's database with broker relationships

2. **User Login:**
   - User provides username and password
   - System validates credentials and returns JWT token
   - Token contains user ID and list of authorized brokers

3. **Accessing Protected Routes:**
   - Client includes JWT token in Authorization header
   - Format: `Authorization: Bearer <token>`
   - Token is validated for authenticity and expiration
   - User's broker access is verified for broker-specific endpoints

4. **Token Security:**
   - Tokens expire after 24 hours
   - Same JWT secret key used across all servers
   - Token includes only necessary user information
   - No sensitive data stored in tokens

## Testing

For testing purposes, you can:

1. Use the sample data endpoints to get test data
2. Check the synced data using the `/api/trade-logs/stored` endpoint
3. Analyze test data with the `/api/analytics` endpoint

## Data Seeding

To populate the broker servers with sample data, use the seed scripts:

### Seeding Broker A Server

```bash
cd broker-a-server
# Using TypeScript
npx ts-node scripts/seedData.ts
```

This will populate the Broker A database with 10 sample trades for stocks (AAPL, MSFT, GOOGL, etc.).

### Seeding Broker B Server

```bash
cd broker-b-server
# Using TypeScript
npx ts-node scripts/seedData.ts
```

This will populate the Broker B database with 10 sample orders for cryptocurrencies (BTC, ETH, SOL, etc.).
