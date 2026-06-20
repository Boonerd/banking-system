package com.bankapp.banking.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Data Transfer Objects (DTOs) and Exception classes.
 * Tests focus on object construction, getters/setters, and proper instantiation.
 */
class DTOAndExceptionTests {

    // ==================== TransactionRequest Tests ====================

    @Test
    void testTransactionRequestConstructor() {
        String accountId = "test-account-123";
        Double amount = 500.0;

        TransactionRequest request = new TransactionRequest(accountId, amount);

        assertEquals(accountId, request.getAccountId());
        assertEquals(amount, request.getAmount());
    }

    @Test
    void testTransactionRequestNoArgConstructor() {
        TransactionRequest request = new TransactionRequest();

        assertNull(request.getAccountId());
        assertNull(request.getAmount());
    }

    @Test
    void testTransactionRequestSetters() {
        TransactionRequest request = new TransactionRequest();
        String accountId = "new-account-456";
        Double amount = 250.0;

        request.setAccountId(accountId);
        request.setAmount(amount);

        assertEquals(accountId, request.getAccountId());
        assertEquals(amount, request.getAmount());
    }

    @Test
    void testTransactionRequestWithZeroAmount() {
        TransactionRequest request = new TransactionRequest("acc-001", 0.0);

        assertEquals("acc-001", request.getAccountId());
        assertEquals(0.0, request.getAmount());
    }

    @Test
    void testTransactionRequestWithNegativeAmount() {
        TransactionRequest request = new TransactionRequest("acc-001", -100.0);

        assertEquals("acc-001", request.getAccountId());
        assertEquals(-100.0, request.getAmount());
    }

    @Test
    void testTransactionRequestWithLargeAmount() {
        Double largeAmount = 1_000_000.99;
        TransactionRequest request = new TransactionRequest("acc-001", largeAmount);

        assertEquals(largeAmount, request.getAmount());
    }

    // ==================== TransactionResponse Tests ====================

    @Test
    void testTransactionResponseConstructor() {
        TransactionResponse response = new TransactionResponse(
            true,
            "Deposit successful",
            "acc-123",
            1500.0,
            "DEPOSIT"
        );

        assertTrue(response.isSuccess());
        assertEquals("Deposit successful", response.getMessage());
        assertEquals("acc-123", response.getAccountId());
        assertEquals(1500.0, response.getNewBalance());
        assertEquals("DEPOSIT", response.getTransactionType());
    }

    @Test
    void testTransactionResponseNoArgConstructor() {
        TransactionResponse response = new TransactionResponse();

        assertFalse(response.isSuccess());
        assertNull(response.getMessage());
        assertNull(response.getAccountId());
        assertNull(response.getNewBalance());
        assertNull(response.getTransactionType());
    }

    @Test
    void testTransactionResponseSetters() {
        TransactionResponse response = new TransactionResponse();

        response.setSuccess(true);
        response.setMessage("Transfer completed");
        response.setAccountId("acc-456");
        response.setNewBalance(2000.0);
        response.setTransactionType("TRANSFER");

        assertTrue(response.isSuccess());
        assertEquals("Transfer completed", response.getMessage());
        assertEquals("acc-456", response.getAccountId());
        assertEquals(2000.0, response.getNewBalance());
        assertEquals("TRANSFER", response.getTransactionType());
    }

    @Test
    void testTransactionResponseFailureScenario() {
        TransactionResponse response = new TransactionResponse(
            false,
            "Insufficient funds",
            "acc-123",
            null,
            "WITHDRAWAL"
        );

        assertFalse(response.isSuccess());
        assertEquals("Insufficient funds", response.getMessage());
        assertNull(response.getNewBalance());
    }

    @Test
    void testTransactionResponseWithNullValues() {
        TransactionResponse response = new TransactionResponse(false, null, null, null, null);

        assertFalse(response.isSuccess());
        assertNull(response.getMessage());
        assertNull(response.getAccountId());
        assertNull(response.getNewBalance());
        assertNull(response.getTransactionType());
    }

    // ==================== TransferRequest Tests ====================

    @Test
    void testTransferRequestConstructor() {
        TransferRequest request = new TransferRequest("from-acc", "to-acc", 300.0);

        assertEquals("from-acc", request.getFromAccountId());
        assertEquals("to-acc", request.getToAccountId());
        assertEquals(300.0, request.getAmount());
    }

    @Test
    void testTransferRequestNoArgConstructor() {
        TransferRequest request = new TransferRequest();

        assertNull(request.getFromAccountId());
        assertNull(request.getToAccountId());
        assertNull(request.getAmount());
    }

    @Test
    void testTransferRequestSetters() {
        TransferRequest request = new TransferRequest();

        request.setFromAccountId("source-acc");
        request.setToAccountId("destination-acc");
        request.setAmount(500.0);

        assertEquals("source-acc", request.getFromAccountId());
        assertEquals("destination-acc", request.getToAccountId());
        assertEquals(500.0, request.getAmount());
    }

    @Test
    void testTransferRequestWithSameAccounts() {
        TransferRequest request = new TransferRequest("same-acc", "same-acc", 100.0);

        assertEquals("same-acc", request.getFromAccountId());
        assertEquals("same-acc", request.getToAccountId());
    }

    @Test
    void testTransferRequestWithLargeAmount() {
        TransferRequest request = new TransferRequest("from", "to", 999_999.99);

        assertEquals(999_999.99, request.getAmount());
    }

    // ==================== TransferResponse Tests ====================

    @Test
    void testTransferResponseConstructor() {
        TransferResponse response = new TransferResponse(
            true,
            "Transfer successful",
            "from-acc",
            "to-acc",
            300.0,
            700.0,
            800.0
        );

        assertTrue(response.isSuccess());
        assertEquals("Transfer successful", response.getMessage());
        assertEquals("from-acc", response.getFromAccountId());
        assertEquals("to-acc", response.getToAccountId());
        assertEquals(300.0, response.getAmount());
        assertEquals(700.0, response.getFromAccountNewBalance());
        assertEquals(800.0, response.getToAccountNewBalance());
    }

    @Test
    void testTransferResponseNoArgConstructor() {
        TransferResponse response = new TransferResponse();

        assertFalse(response.isSuccess());
        assertNull(response.getMessage());
        assertNull(response.getFromAccountId());
        assertNull(response.getToAccountId());
        assertNull(response.getAmount());
        assertNull(response.getFromAccountNewBalance());
        assertNull(response.getToAccountNewBalance());
    }

    @Test
    void testTransferResponseSetters() {
        TransferResponse response = new TransferResponse();

        response.setSuccess(true);
        response.setMessage("Success");
        response.setFromAccountId("from");
        response.setToAccountId("to");
        response.setAmount(150.0);
        response.setFromAccountNewBalance(850.0);
        response.setToAccountNewBalance(650.0);

        assertTrue(response.isSuccess());
        assertEquals("Success", response.getMessage());
        assertEquals("from", response.getFromAccountId());
        assertEquals("to", response.getToAccountId());
        assertEquals(150.0, response.getAmount());
        assertEquals(850.0, response.getFromAccountNewBalance());
        assertEquals(650.0, response.getToAccountNewBalance());
    }

    @Test
    void testTransferResponseFailureScenario() {
        TransferResponse response = new TransferResponse(
            false,
            "Insufficient funds in source account",
            "from-acc",
            "to-acc",
            null,
            null,
            null
        );

        assertFalse(response.isSuccess());
        assertEquals("Insufficient funds in source account", response.getMessage());
        assertNull(response.getAmount());
        assertNull(response.getFromAccountNewBalance());
        assertNull(response.getToAccountNewBalance());
    }

    // ==================== BalanceResponse Tests ====================

    @Test
    void testBalanceResponseConstructor() {
        BalanceResponse response = new BalanceResponse("acc-123", 1500.0);

        assertEquals("acc-123", response.getAccountId());
        assertEquals(1500.0, response.getBalance());
    }

    @Test
    void testBalanceResponseNoArgConstructor() {
        BalanceResponse response = new BalanceResponse();

        assertNull(response.getAccountId());
        assertNull(response.getBalance());
    }

    @Test
    void testBalanceResponseSetters() {
        BalanceResponse response = new BalanceResponse();

        response.setAccountId("new-acc");
        response.setBalance(2000.0);

        assertEquals("new-acc", response.getAccountId());
        assertEquals(2000.0, response.getBalance());
    }

    @Test
    void testBalanceResponseWithZeroBalance() {
        BalanceResponse response = new BalanceResponse("zero-balance-acc", 0.0);

        assertEquals("zero-balance-acc", response.getAccountId());
        assertEquals(0.0, response.getBalance());
    }

    @Test
    void testBalanceResponseWithLargeBalance() {
        BalanceResponse response = new BalanceResponse("rich-acc", 99_999_999.99);

        assertEquals(99_999_999.99, response.getBalance());
    }

    @Test
    void testBalanceResponseWithNegativeBalance() {
        // Note: Negative balance should not occur in normal operation,
        // but test demonstrates that DTO accepts any value
        BalanceResponse response = new BalanceResponse("acc", -100.0);

        assertEquals(-100.0, response.getBalance());
    }

    // ==================== Exception Tests ====================

    @Test
    void testInsufficientFundsExceptionConstructor() {
        String message = "Insufficient funds. Available: 100.0, Requested: 500.0";
        com.bankapp.banking.exception.InsufficientFundsException exception =
            new com.bankapp.banking.exception.InsufficientFundsException(message);

        assertEquals(message, exception.getMessage());
        assertInstanceOf(RuntimeException.class, exception);
    }

    @Test
    void testInsufficientFundsExceptionThrow() {
        String message = "Account balance too low";

        assertThrows(
            com.bankapp.banking.exception.InsufficientFundsException.class,
            () -> {
                throw new com.bankapp.banking.exception.InsufficientFundsException(message);
            }
        );
    }

    @Test
    void testInsufficientFundsExceptionWithDetailedMessage() {
        String message = "Withdrawal failed: Requested 1000.00 but balance is only 500.00";
        com.bankapp.banking.exception.InsufficientFundsException exception =
            new com.bankapp.banking.exception.InsufficientFundsException(message);

        assertTrue(exception.getMessage().contains("Withdrawal failed"));
        assertTrue(exception.getMessage().contains("1000.00"));
        assertTrue(exception.getMessage().contains("500.00"));
    }

    @Test
    void testAccountNotFoundExceptionConstructor() {
        String message = "Account not found: xyz-123";
        com.bankapp.banking.exception.AccountNotFoundException exception =
            new com.bankapp.banking.exception.AccountNotFoundException(message);

        assertEquals(message, exception.getMessage());
        assertInstanceOf(RuntimeException.class, exception);
    }

    @Test
    void testAccountNotFoundExceptionThrow() {
        String message = "Account does not exist";

        assertThrows(
            com.bankapp.banking.exception.AccountNotFoundException.class,
            () -> {
                throw new com.bankapp.banking.exception.AccountNotFoundException(message);
            }
        );
    }

    @Test
    void testAccountNotFoundExceptionWithAccountId() {
        String accountId = "invalid-account-456";
        String message = "Account not found: " + accountId;
        com.bankapp.banking.exception.AccountNotFoundException exception =
            new com.bankapp.banking.exception.AccountNotFoundException(message);

        assertTrue(exception.getMessage().contains(accountId));
    }

    @Test
    void testExceptionsAreCatchable() {
        String exceptionMessage = "Test exception";

        // Test InsufficientFundsException
        try {
            throw new com.bankapp.banking.exception.InsufficientFundsException(exceptionMessage);
        } catch (RuntimeException e) {
            assertEquals(exceptionMessage, e.getMessage());
        }

        // Test AccountNotFoundException
        try {
            throw new com.bankapp.banking.exception.AccountNotFoundException(exceptionMessage);
        } catch (RuntimeException e) {
            assertEquals(exceptionMessage, e.getMessage());
        }
    }

    @Test
    void testExceptionStackTrace() {
        com.bankapp.banking.exception.InsufficientFundsException exception =
            new com.bankapp.banking.exception.InsufficientFundsException("Test");

        assertNotNull(exception.getStackTrace());
        assertTrue(exception.getStackTrace().length > 0);
    }
}
