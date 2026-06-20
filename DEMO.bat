@echo off
REM Quick Start Demo Script for Banking System REST API (Windows)

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080/api/accounts

echo.
echo 🏦 Banking System REST API - Quick Demo
echo ========================================
echo.

REM 1. Create first account
echo 1️⃣  Creating Account: Alice (Initial Balance: $1000)
for /f "delims=" %%A in ('curl -s -X POST "%BASE_URL%?name=Alice%%20Johnson^&balance=1000"') do set ALICE_RESPONSE=%%A
for /f "delims=" %%B in ('echo !ALICE_RESPONSE! ^| jq -r ".id"') do set ALICE_ID=%%B
echo    Alice's Account ID: !ALICE_ID!
echo    Response:
echo !ALICE_RESPONSE! | jq '.'
echo.

REM 2. Create second account
echo 2️⃣  Creating Account: Bob (Initial Balance: $500)
for /f "delims=" %%A in ('curl -s -X POST "%BASE_URL%?name=Bob%%20Smith^&balance=500"') do set BOB_RESPONSE=%%A
for /f "delims=" %%B in ('echo !BOB_RESPONSE! ^| jq -r ".id"') do set BOB_ID=%%B
echo    Bob's Account ID: !BOB_ID!
echo    Response:
echo !BOB_RESPONSE! | jq '.'
echo.

REM 3. Deposit to Alice's account
echo 3️⃣  DEPOSIT: Adding $200 to Alice's account
for /f "delims=" %%A in ('curl -s -X POST "%BASE_URL%/deposit" -H "Content-Type: application/json" -d "{\"accountId\":\"!ALICE_ID!\",\"amount\":200}"') do set DEPOSIT_RESPONSE=%%A
echo    Response:
echo !DEPOSIT_RESPONSE! | jq '.'
echo.

REM 4. Check Alice's balance
echo 4️⃣  GET BALANCE: Checking Alice's balance
for /f "delims=" %%A in ('curl -s "%BASE_URL%/!ALICE_ID!/balance"') do set BALANCE_RESPONSE=%%A
echo    Response:
echo !BALANCE_RESPONSE! | jq '.'
echo.

REM 5. Transfer from Alice to Bob
echo 5️⃣  TRANSFER: Moving $300 from Alice to Bob
for /f "delims=" %%A in ('curl -s -X POST "%BASE_URL%/transfer" -H "Content-Type: application/json" -d "{\"fromAccountId\":\"!ALICE_ID!\",\"toAccountId\":\"!BOB_ID!\",\"amount\":300}"') do set TRANSFER_RESPONSE=%%A
echo    Response:
echo !TRANSFER_RESPONSE! | jq '.'
echo.

REM 6. Withdraw from Bob's account
echo 6️⃣  WITHDRAW: Removing $150 from Bob's account
for /f "delims=" %%A in ('curl -s -X POST "%BASE_URL%/withdraw" -H "Content-Type: application/json" -d "{\"accountId\":\"!BOB_ID!\",\"amount\":150}"') do set WITHDRAW_RESPONSE=%%A
echo    Response:
echo !WITHDRAW_RESPONSE! | jq '.'
echo.

REM 7. Final balances
echo 7️⃣  FINAL BALANCES:
echo    Alice's Balance:
curl -s "%BASE_URL%/!ALICE_ID!/balance" | jq '.'
echo.
echo    Bob's Balance:
curl -s "%BASE_URL%/!BOB_ID!/balance" | jq '.'
echo.

REM 8. Summary
echo ✅ Demo Complete!
echo ========================================
echo Summary:
echo   - Alice: Started with $1000
echo   - Bob: Started with $500
echo   - Alice deposited $200 ^→ $1200
echo   - Alice transferred $300 to Bob
echo   - Bob withdrew $150
echo   - Final: Alice has $900, Bob has $650
