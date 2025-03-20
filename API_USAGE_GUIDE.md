# API Usage Guide for Trade Analytics Platform

This guide provides step-by-step instructions on how to test the API routes of the Trade Analytics Platform using Postman, along with sample data for creating multiple users and trades.

## Prerequisites

1. Install [Postman](https://www.postman.com/downloads/)
2. Start all three servers:
   ```bash
   # In three separate terminal windows:
   
   # Terminal 1 - Main Server
   cd main-server
   npm run dev    # Server runs on port 3000
   
   # Terminal 2 - Broker A Server
   cd broker-a-server
   npm run dev    # Server runs on port 3001
   
   # Terminal 3 - Broker B Server
   cd broker-b-server
   npm run dev    # Server runs on port 3002
   ```

## Testing Flow

Follow this sequence to properly test the platform:

1. Register users on the Main Server
2. Login to get JWT tokens
3. Use the tokens to add trades in Broker Servers
4. Sync and view trades in the Main Server
5. Generate analytics

---

## Main Server Routes (http://localhost:3000)

### 1. User Registration

**Endpoint:** `POST /api/auth/register`  
**Content-Type:** `application/json`

**Create Multiple Users:**

1. **User with access to both brokers:**
```json
{
    "username": "trader1",
    "email": "trader1@example.com",
    "password": "securepass123",
    "firstName": "John",
    "lastName": "Doe",
    "brokerCodes": ["brokerA", "brokerB"]
}
```

2. **User with access to Broker A only:**
```json
{
    "username": "trader2",
    "email": "trader2@example.com",
    "password": "securepass456",
    "firstName": "Jane",
    "lastName": "Smith",
    "brokerCodes": ["brokerA"]
}
```

3. **User with access to Broker B only:**
```json
{
    "username": "trader3",
    "email": "trader3@example.com",
    "password": "securepass789",
    "firstName": "Bob",
    "lastName": "Wilson",
    "brokerCodes": ["brokerB"]
}
```

### 2. User Login

**Endpoint:** `POST /api/auth/login`  
**Content-Type:** `application/json`

**Sample Login:**
```json
{
    "username": "trader1",
    "password": "securepass123"
}
```

**Response will include JWT token:**
```json
{
    "message": "Login successful",
    "user": {
        "id": "...",
        "username": "trader1",
        "brokers": ["brokerA", "brokerB"]
    },
    "token": "eyJhbG..."  // Save this token for subsequent requests
}
```

---

## Broker A Server Routes (http://localhost:3001)

### 1. Add Trades for Different Users

**Endpoint:** `POST /api/trades/broker-a`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}
- Content-Type: application/json

**Sample Trades for trader1:**
```json
{
    "tradeId": "A1001",
    "symbol": "AAPL",
    "quantity": 100,
    "price": 150.75,
    "timestamp": "2024-03-15T10:30:00Z"
}
```

```json
{
    "tradeId": "A1002",
    "symbol": "MSFT",
    "quantity": 50,
    "price": 290.50,
    "timestamp": "2024-03-15T11:15:00Z"
}
```

**Sample Trades for trader2:**
```json
{
    "tradeId": "A2001",
    "symbol": "GOOGL",
    "quantity": 25,
    "price": 140.25,
    "timestamp": "2024-03-15T13:45:00Z"
}
```

### 2. Get User's Trades

**Endpoint:** `GET /api/trades/broker-a`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}

---

## Broker B Server Routes (http://localhost:3002)

### 1. Add Orders for Different Users

**Endpoint:** `POST /api/trades/broker-b`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}
- Content-Type: application/json

**Sample Orders for trader1:**
```json
{
    "orderId": "B1001",
    "asset": "BTC",
    "amount": 1.5,
    "cost": 45000.00,
    "executedAt": "2024-03-15T10:45:00Z"
}
```

```json
{
    "orderId": "B1002",
    "asset": "ETH",
    "amount": 10,
    "cost": 2500.00,
    "executedAt": "2024-03-15T11:30:00Z"
}
```

**Sample Orders for trader3:**
```json
{
    "orderId": "B3001",
    "asset": "SOL",
    "amount": 100,
    "cost": 110.50,
    "executedAt": "2024-03-15T14:20:00Z"
}
```

### 2. Get User's Orders

**Endpoint:** `GET /api/trades/broker-b`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}

---

## Main Server - Trade Management

### 1. Sync Trades from All Brokers

**Endpoint:** `POST /api/trade-logs/sync`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}

This endpoint will fetch and store trades from all brokers the user has access to.

### 2. View Stored Trade Logs

**Endpoint:** `GET /api/trade-logs/stored`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}

Returns all trades stored in the main server for the authenticated user.

### 3. Generate Analytics

**Endpoint:** `GET /api/analytics`  
**Headers:**
- Authorization: Bearer {JWT_TOKEN}

Returns performance metrics and AI-generated insights for the user's trades.

---

## Testing Flow Example

1. **Create Users:**
   - Register trader1, trader2, and trader3 using the registration endpoint
   - Login with each user to get their JWT tokens

2. **Add Trades (Using trader1's token):**
   - Add AAPL and MSFT trades to Broker A
   - Add BTC and ETH orders to Broker B
   - These trades will only be visible to trader1

3. **Add More Trades:**
   - Use trader2's token to add GOOGL trade to Broker A
   - Use trader3's token to add SOL order to Broker B

4. **Sync and View Trades:**
   - Use trader1's token to sync trades (will get trades from both brokers)
   - Use trader2's token to sync trades (will only get Broker A trades)
   - Use trader3's token to sync trades (will only get Broker B trades)

5. **Generate Analytics:**
   - Use each user's token to get analytics for their trades

## Common HTTP Status Codes

- 201: Resource created successfully (Registration, Adding trades)
- 200: Request successful (Login, Get trades, Analytics)
- 401: Unauthorized (Invalid or missing token)
- 403: Forbidden (Trying to access unauthorized broker)
- 404: Resource not found
- 500: Server error

## Tips

1. Save the JWT tokens in Postman environment variables for easy access
2. Test with multiple users to verify proper data isolation
3. Verify that users can only access their authorized brokers
4. Check that the sync endpoint correctly fetches trades from all authorized brokers
5. Verify that analytics are generated only for the authenticated user's trades

## Sample Postman Collection

Create a Postman collection with the following structure:

```
Trade Analytics Platform
├── Auth
│   ├── Register User
│   └── Login User
├── Broker A
│   ├── Add Trade
│   └── Get Trades
├── Broker B
│   ├── Add Order
│   └── Get Orders
└── Main Server
    ├── Sync Trades
    ├── View Trade Logs
    └── Generate Analytics
```

Set up environment variables for:
- MAIN_SERVER_URL (http://localhost:3000)
- BROKER_A_URL (http://localhost:3001)
- BROKER_B_URL (http://localhost:3002)
- JWT_TOKEN (to be set after login)

This structure helps organize and streamline your testing process.