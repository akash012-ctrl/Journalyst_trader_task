# Trade Analytics Platform

## Overview

The Trade Analytics Platform is a comprehensive solution that integrates with multiple broker APIs, processes trade data, and provides analytical insights using LLM technology. The platform enables traders to consolidate their trading data from different brokers, analyze performance metrics, and receive AI-generated improvement suggestions.

## Project Architecture

```
Trade Analytics Platform
├── Broker A Server (Port 3001)
│   ├── API Endpoints
│   │   └── /api/trades/broker-a
│   └── MongoDB: broker-a-db
├── Broker B Server (Port 3002)
│   ├── API Endpoints
│   │   └── /api/trades/broker-b
│   └── MongoDB: broker-b-db
└── Main Platform Server (Port 3000)
    ├── API Endpoints
    │   ├── /api/auth
    │   ├── /api/trade-logs
    │   └── /api/analytics
    ├── MongoDB: trade-analytics-db
    └── LLM Integration
```

## Core Components

### Broker A Server
- Simulates a broker API providing stock trade data
- Uses a standardized trade format:
  ```json
  {
    "tradeId": "string",
    "symbol": "string",
    "quantity": "number",
    "price": "number",
    "timestamp": "string"
  }
  ```
- Implements JWT authentication for secure access
- Endpoint: `/api/trades/broker-a`

### Broker B Server
- Simulates a broker API providing cryptocurrency order data
- Uses a different data format:
  ```json
  {
    "orderId": "string",
    "asset": "string",
    "amount": "number",
    "cost": "number",
    "executedAt": "string"
  }
  ```
- Implements JWT authentication for secure access
- Endpoint: `/api/trades/broker-b`

### Main Platform Server
- Central server that orchestrates data flow and provides unified analytics
- Key components:
  - **Authentication System**: User registration, login, and JWT token management
  - **Data Integration**: Fetches and normalizes data from multiple brokers
  - **Data Transformation**: Converts broker-specific formats into a unified schema
  - **LLM Integration**: Generates trading insights using language model
  - **Analytics Engine**: Calculates performance metrics and visualizes results

### Database Schema

#### User Profile Table
- User credentials and personal information
- Relationships to authorized brokers

#### Broker Table
- Information about integrated brokers
- API endpoints and authentication details

#### Trade Logs Table
- Unified trade data from multiple sources
- References to user and broker entities
- Transformed and normalized trading information

### Security Features
- JWT-based authentication across all servers
- User-specific broker authorization
- Secure password hashing with bcrypt
- Protected API endpoints
- Data validation and sanitization

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
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
   npm run dev
   ```

   **Broker B Server:**
   ```bash
   cd broker-b-server
   npm install
   npm run dev
   ```

   **Main Server:**
   ```bash
   cd main-server
   npm install
   npm run dev
   ```

3. Seed the databases:
   - **Broker A Server:**
     ```bash
     npm run seed
     ```
   - **Broker B Server:**
     ```bash
     npm run seed
     ```
   - **Main Server:**
     ```bash
     npm run seed-brokers
     ```

4. All servers should now be running concurrently.

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register`: Register a new user with broker access permissions
- `POST /api/auth/login`: Authenticate user and retrieve JWT token

### Broker A Server (Protected Routes)
- `GET /api/trades/broker-a`: Get all trades from Broker A for authenticated user
- `POST /api/trades/broker-a`: Add a new trade to Broker A

### Broker B Server (Protected Routes)
- `GET /api/trades/broker-b`: Get all orders from Broker B for authenticated user
- `POST /api/trades/broker-b`: Add a new order to Broker B

### Main Platform Server (Protected Routes)
- `GET /api/trade-logs`: Fetch raw trade logs from user's authorized brokers
- `POST /api/trade-logs/sync`: Fetch and store trade logs from user's brokers
- `GET /api/trade-logs/stored`: Get all stored trade logs for the authenticated user
- `GET /api/analytics`: Get performance metrics and AI-generated insights

## Data Flow

1. **User Authentication**:
   - User registers and selects accessible brokers
   - User logs in and receives JWT token

2. **Data Collection**:
   - Main server uses JWT token to fetch data from brokers
   - Each broker validates token and returns user-specific data

3. **Data Processing**:
   - Raw broker data is transformed into a unified format
   - Additional metrics are calculated for analytics

4. **Storage**:
   - Transformed trade data is stored in the main server's database
   - User-specific records are maintained for isolation

5. **Analytics Generation**:
   - Performance metrics are calculated from stored trade data
   - Trade patterns are analyzed for insights
   - LLM generates actionable suggestions

## Development Features

### TypeScript Implementation
- Strong typing for API requests and responses
- Type guards for runtime validation
- Interfaces for database models
- Enhanced developer experience

### Error Handling
- Centralized error handling middleware
- Appropriate HTTP status codes
- Detailed error logging
- Environment-specific error responses

### Data Validation
- Zod schemas for request validation
- Type guards for runtime data checking
- Input sanitization for security

## Testing

Refer to the [API_USAGE_GUIDE.md](./API_USAGE_GUIDE.md) for detailed instructions on testing the platform using Postman.

## Security Considerations
- JWT authentication with expiration
- Broker-specific access controls
- Password hashing with bcrypt
- Environment variable management
- Input validation and sanitization

## Future Enhancements
- Real-time trade data with WebSockets
- Enhanced visualization dashboards
- Additional broker integrations
- Machine learning for advanced pattern recognition
- Portfolio optimization suggestions
