# 🏦 Banking System REST API - Quick Reference

## Server
```bash
./mvnw spring-boot:run
# Server: http://localhost:8080
```

## 4 Core Endpoints

### 1️⃣ Deposit
```bash
POST /api/accounts/deposit
Content-Type: application/json

{
  "accountId": "abc12345",
  "amount": 200
}
```
✅ Increases balance  
✅ Validates amount > 0  
✅ Returns new balance  

---

### 2️⃣ Withdraw
```bash
POST /api/accounts/withdraw
Content-Type: application/json

{
  "accountId": "abc12345",
  "amount": 100
}
```
✅ Decreases balance  
✅ Checks sufficient funds  
✅ Returns new balance  

---

### 3️⃣ Transfer
```bash
POST /api/accounts/transfer
Content-Type: application/json

{
  "fromAccountId": "acc1",
  "toAccountId": "acc2",
  "amount": 300
}
```
✅ Moves money between accounts  
✅ Validates both accounts exist  
✅ Checks source has sufficient funds  
✅ Thread-safe double-lock  

---

### 4️⃣ Get Balance
```bash
GET /api/accounts/{id}/balance
```
✅ Returns current balance  
✅ Quick read operation  

---

## Helper Endpoints

### Create Account
```bash
POST /api/accounts?name=John%20Doe&balance=1000
```
Returns account with auto-generated ID

### Get Account Details
```bash
GET /api/accounts/{id}
```

### List All Accounts
```bash
GET /api/accounts
```

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Transaction successful |
| 201 | Created | Account created |
| 400 | Bad Request | Invalid input (negative amount, etc.) |
| 404 | Not Found | Account doesn't exist |
| 409 | Conflict | Insufficient funds |

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "accountId": "abc12345",
  "newBalance": 1200.0,
  "transactionType": "DEPOSIT"
}
```

### Error
```json
{
  "success": false,
  "message": "Insufficient funds",
  "accountId": "abc12345",
  "newBalance": null,
  "transactionType": "WITHDRAWAL"
}
```

---

## One-Liner Examples

```bash
# Create account
curl -X POST "http://localhost:8080/api/accounts?name=Alice&balance=1000"

# Deposit
curl -X POST "http://localhost:8080/api/accounts/deposit" \
  -H "Content-Type: application/json" \
  -d '{"accountId":"id123","amount":200}'

# Withdraw
curl -X POST "http://localhost:8080/api/accounts/withdraw" \
  -H "Content-Type: application/json" \
  -d '{"accountId":"id123","amount":100}'

# Transfer
curl -X POST "http://localhost:8080/api/accounts/transfer" \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId":"id1","toAccountId":"id2","amount":300}'

# Check Balance
curl "http://localhost:8080/api/accounts/id123/balance"
```

---

## Testing

```bash
# Run all tests
./mvnw clean test

# Skip tests and build
./mvnw clean package -DskipTests

# Run app
./mvnw spring-boot:run
```

---

## Demo Scripts

```bash
# Unix/Linux/Mac
bash DEMO.sh

# Windows
DEMO.bat
```

---

## Key Features

✅ **In-Memory** - No database needed  
✅ **Thread-Safe** - Synchronized operations  
✅ **Validated** - Input & business logic checks  
✅ **Fast** - O(1) account lookups  
✅ **Clean** - Well-structured code  

---

See `API_DOCUMENTATION.md` for detailed documentation  
See `IMPLEMENTATION_SUMMARY.md` for full details
