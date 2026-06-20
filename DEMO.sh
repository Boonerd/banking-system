#!/usr/bin/env bash
# Quick Start Demo Script for Banking System REST API

BASE_URL="http://localhost:8080/api/accounts"

echo "🏦 Banking System REST API - Quick Demo"
echo "========================================"
echo ""

# 1. Create first account
echo "1️⃣  Creating Account: Alice (Initial Balance: $1000)"
ALICE_RESPONSE=$(curl -s -X POST "$BASE_URL?name=Alice%20Johnson&balance=1000")
ALICE_ID=$(echo $ALICE_RESPONSE | jq -r '.id')
echo "   Alice's Account ID: $ALICE_ID"
echo "   Response: $ALICE_RESPONSE" | jq '.'
echo ""

# 2. Create second account
echo "2️⃣  Creating Account: Bob (Initial Balance: $500)"
BOB_RESPONSE=$(curl -s -X POST "$BASE_URL?name=Bob%20Smith&balance=500")
BOB_ID=$(echo $BOB_RESPONSE | jq -r '.id')
echo "   Bob's Account ID: $BOB_ID"
echo "   Response: $BOB_RESPONSE" | jq '.'
echo ""

# 3. Deposit to Alice's account
echo "3️⃣  DEPOSIT: Adding $200 to Alice's account"
DEPOSIT_RESPONSE=$(curl -s -X POST "$BASE_URL/deposit" \
  -H "Content-Type: application/json" \
  -d "{\"accountId\":\"$ALICE_ID\",\"amount\":200}")
echo "   Response: $DEPOSIT_RESPONSE" | jq '.'
echo ""

# 4. Check Alice's balance
echo "4️⃣  GET BALANCE: Checking Alice's balance"
BALANCE_RESPONSE=$(curl -s "$BASE_URL/$ALICE_ID/balance")
echo "   Response: $BALANCE_RESPONSE" | jq '.'
echo ""

# 5. Transfer from Alice to Bob
echo "5️⃣  TRANSFER: Moving $300 from Alice to Bob"
TRANSFER_RESPONSE=$(curl -s -X POST "$BASE_URL/transfer" \
  -H "Content-Type: application/json" \
  -d "{\"fromAccountId\":\"$ALICE_ID\",\"toAccountId\":\"$BOB_ID\",\"amount\":300}")
echo "   Response: $TRANSFER_RESPONSE" | jq '.'
echo ""

# 6. Withdraw from Bob's account
echo "6️⃣  WITHDRAW: Removing $150 from Bob's account"
WITHDRAW_RESPONSE=$(curl -s -X POST "$BASE_URL/withdraw" \
  -H "Content-Type: application/json" \
  -d "{\"accountId\":\"$BOB_ID\",\"amount\":150}")
echo "   Response: $WITHDRAW_RESPONSE" | jq '.'
echo ""

# 7. Final balances
echo "7️⃣  FINAL BALANCES:"
echo "   Alice's Balance:"
curl -s "$BASE_URL/$ALICE_ID/balance" | jq '.'
echo ""
echo "   Bob's Balance:"
curl -s "$BASE_URL/$BOB_ID/balance" | jq '.'
echo ""

# 8. Summary
echo "✅ Demo Complete!"
echo "========================================"
echo "Summary:"
echo "  - Alice: Started with $1000"
echo "  - Bob: Started with $500"
echo "  - Alice deposited $200 → $1200"
echo "  - Alice transferred $300 to Bob"
echo "  - Bob withdrew $150"
echo "  - Final: Alice has $900, Bob has $650"
