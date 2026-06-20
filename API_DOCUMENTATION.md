# Banking System REST API

A clean, functional banking microservice with in-memory account management and REST endpoints for common banking operations.

## Core Features

- **In-Memory Storage**: Fast, simple account management without database overhead
- **4 Clean REST Endpoints**: Deposit, withdraw, transfer, and balance inquiry
- **Thread-Safe Operations**: Synchronized transactions to prevent race conditions
- **Validation & Error Handling**: Comprehensive checks for insufficient funds and invalid operations

## REST API Endpoints

### 1. Create Account
**POST** `/api/accounts`
- **Purpose**: Create a new bank account with initial balance
- **Request Parameters**:
  - `name` (query param): Account holder name
  - `balance` (query param): Initial account balance (must be positive)
- **Response**: Account object with generated account ID
- **Example**:
  ```bash
  curl -X POST "http://localhost:8080/api/accounts?name=John%20Doe&balance=1000"
  ```

### 2. Deposit Money ⭐ (Endpoint 1)
**POST** `/api/accounts/deposit`
- **Purpose**: Deposit money into an account
- **Request Body**:
  ```json
  {
    "accountId": "abc12345",
    "amount": 500.00
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Deposit successful",
    "accountId": "abc12345",
    "newBalance": 1500.00,
    "transactionType": "DEPOSIT"
  }
  ```
- **Validations**:
  - Amount must be positive
  - Account must exist
- **HTTP Status**: 200 (OK), 400 (Bad Request), 404 (Not Found)

### 3. Withdraw Money ⭐ (Endpoint 2)
**POST** `/api/accounts/withdraw`
- **Purpose**: Withdraw money from an account with insufficient funds check
- **Request Body**:
  ```json
  {
    "accountId": "abc12345",
    "amount": 300.00
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Withdrawal successful",
    "accountId": "abc12345",
    "newBalance": 1200.00,
    "transactionType": "WITHDRAWAL"
  }
  ```
- **Validations**:
  - Amount must be positive
  - Account must exist
  - **Insufficient funds check**: Account must have at least the requested amount
- **HTTP Status**: 200 (OK), 400 (Bad Request), 404 (Not Found), 409 (Conflict - insufficient funds)

### 4. Transfer Money ⭐ (Endpoint 3)
**POST** `/api/accounts/transfer`
- **Purpose**: Transfer money from one account to another with validation
- **Request Body**:
  ```json
  {
    "fromAccountId": "abc12345",
    "toAccountId": "xyz98765",
    "amount": 250.00
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Transfer successful",
    "fromAccountId": "abc12345",
    "toAccountId": "xyz98765",
    "amount": 250.00,
    "fromAccountNewBalance": 1000.00,
    "toAccountNewBalance": 750.00
  }
  ```
- **Validations**:
  - Amount must be positive
  - Both accounts must exist
  - Source account must have sufficient funds
  - Source and destination accounts cannot be the same
- **Thread-Safe**: Double-synchronized on both accounts to prevent race conditions
- **HTTP Status**: 200 (OK), 400 (Bad Request), 404 (Not Found), 409 (Conflict - insufficient funds)

### 5. Get Balance ⭐ (Endpoint 4)
**GET** `/api/accounts/{id}/balance`
- **Purpose**: Inquiry endpoint to get current account balance
- **Path Parameter**:
  - `id`: Account ID (e.g., `abc12345`)
- **Response**:
  ```json
  {
    "accountId": "abc12345",
    "balance": 1000.00
  }
  ```
- **HTTP Status**: 200 (OK), 404 (Not Found)
- **Example**:
  ```bash
  curl "http://localhost:8080/api/accounts/abc12345/balance"
  ```

### Additional Endpoints

**GET** `/api/accounts/{id}`
- Get complete account details by account ID

**GET** `/api/accounts`
- List all accounts (admin endpoint)

## Quick Start Demo

```bash
# 1. Create two accounts
ACCOUNT1=$(curl -s -X POST "http://localhost:8080/api/accounts?name=Alice&balance=1000" | jq -r '.id')
ACCOUNT2=$(curl -s -X POST "http://localhost:8080/api/accounts?name=Bob&balance=500" | jq -r '.id')

# 2. Deposit $200 into Alice's account
curl -X POST "http://localhost:8080/api/accounts/deposit" \
  -H "Content-Type: application/json" \
  -d "{\"accountId\":\"$ACCOUNT1\",\"amount\":200}"

# 3. Check Alice's balance
curl "http://localhost:8080/api/accounts/$ACCOUNT1/balance"

# 4. Transfer $300 from Alice to Bob
curl -X POST "http://localhost:8080/api/accounts/transfer" \
  -H "Content-Type: application/json" \
  -d "{\"fromAccountId\":\"$ACCOUNT1\",\"toAccountId\":\"$ACCOUNT2\",\"amount\":300}"

# 5. Withdraw $100 from Bob's account
curl -X POST "http://localhost:8080/api/accounts/withdraw" \
  -H "Content-Type: application/json" \
  -d "{\"accountId\":\"$ACCOUNT2\",\"amount\":100}"
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

| Status | Scenario | Example |
|--------|----------|---------|
| 200 OK | Transaction successful | Deposit, withdrawal, transfer completed |
| 201 Created | Account created | New account created successfully |
| 400 Bad Request | Invalid input | Negative amount, amount = 0, same from/to account |
| 404 Not Found | Account doesn't exist | Account ID not found |
| 409 Conflict | Business logic violation | Insufficient funds |

## Architecture

- **In-Memory Storage**: `HashMap<String, Account>` for fast O(1) lookups
- **Thread Safety**: Synchronized blocks prevent race conditions in concurrent transactions
- **Exception Handling**: Custom exceptions for business logic errors (InsufficientFundsException, AccountNotFoundException)
- **DTO Pattern**: Clean separation between request/response objects and domain models
- **Stateless Design**: Monolithic service with no external dependencies for rapid prototyping

## Running the Application

```bash
# Start the application
./mvnw spring-boot:run

# Default URL: http://localhost:8080
```

## Application Configuration

- **Server Port**: 8080
- **Application Name**: Banking System Microservices
- **Database**: In-memory (no persistence)
- **Data Loss**: All accounts are cleared on application restart
