package com.bankapp.banking.controller;

import com.bankapp.banking.dto.AccountResponse;
import com.bankapp.banking.dto.BalanceResponse;
import com.bankapp.banking.dto.LoginRequest;
import com.bankapp.banking.dto.SignupRequest;
import com.bankapp.banking.dto.TransactionRequest;
import com.bankapp.banking.dto.TransactionResponse;
import com.bankapp.banking.dto.TransferRequest;
import com.bankapp.banking.dto.TransferResponse;
import com.bankapp.banking.entity.Account;
import com.bankapp.banking.exception.AccountNotFoundException;
import com.bankapp.banking.exception.InsufficientFundsException;
import com.bankapp.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173") // Allow CORS for all origins (for testing purposes)
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * Create a new bank account
     */
    @PostMapping("/signup")
    public ResponseEntity<AccountResponse> signup(@RequestBody SignupRequest request) {
        if (request.getName() == null || request.getEmail() == null || request.getPhoneNumber() == null
            || request.getPin() == null || request.getCurrency() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Account account = accountService.createAccount(
            request.getName(),
            request.getEmail(),
            request.getPhoneNumber(),
            request.getPin(),
            java.math.BigDecimal.ZERO,
            request.getCurrency().toUpperCase()
        );

        AccountResponse response = new AccountResponse(
            account.getId(),
            account.getAccountNumber(),
            account.getAccountHolderName(),
            account.getEmail(),
            account.getPhoneNumber(),
            account.getBalance().doubleValue(),
            account.getCurrency()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmailOrPhone() == null || request.getPin() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email/phone and PIN are required.");
        }

        Account account = accountService.findByEmail(request.getEmailOrPhone())
            .or(() -> accountService.findByPhoneNumber(request.getEmailOrPhone()))
            .orElse(null);

        if (account == null || !accountService.verifyPin(account, request.getPin())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
        }

        AccountResponse response = new AccountResponse(
            account.getId(),
            account.getAccountNumber(),
            account.getAccountHolderName(),
            account.getEmail(),
            account.getPhoneNumber(),
            account.getBalance().doubleValue(),
            account.getCurrency()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint 1: Deposit money into an account
     * POST /api/accounts/deposit
     */
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody TransactionRequest request) {
        try {
            // Convert to double if your service method accepts Double
            Account account = accountService.deposit(request.getAccountNumber(), request.getAmount());
            
            // Using a default empty constructor matching what you had earlier
            TransactionResponse response = new TransactionResponse(
                true,
                "Deposit successful",
                account.getAccountNumber(),
                account.getBalance().doubleValue(),
                "DEPOSIT"
            );
            // If your DTO has setters, you can set them here, otherwise returning it empty clears the compiler error!
            return ResponseEntity.ok(response);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "DEPOSIT"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "DEPOSIT"));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody TransactionRequest request) {
        try {
            // Converted the argument parameter pattern to request.getAmount() directly as a double
            Account account = accountService.withdraw(request.getAccountNumber(), request.getAmount());
            
            TransactionResponse response = new TransactionResponse(
                true,
                "Withdrawal successful",
                account.getAccountNumber(),
                account.getBalance().doubleValue(),
                "WITHDRAWAL"            
            );
            return ResponseEntity.ok(response);
        } catch (InsufficientFundsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "WITHDRAWAL"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "WITHDRAWAL"));
        }
    }
    /**
     * Endpoint 3: Transfer money between accounts
     * POST /api/accounts/transfer
     */
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            accountService.transfer(request.getFromAccountId(), request.getToAccountId(), request.getAmount());
            
            TransferResponse response = new TransferResponse(
            );
            return ResponseEntity.ok(response);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new TransferResponse(false, e.getMessage(), null, null, null, null, null));
        } catch (InsufficientFundsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new TransferResponse(false, e.getMessage(), null, null, null, null, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new TransferResponse(false, e.getMessage(), null, null, null, null, null));
        }
    }

    /**
     * Endpoint 4: Get balance for a specific account
     * GET /api/accounts/{id}/balance
     */
    @GetMapping("/{id}/balance")
    public ResponseEntity<?> getBalance(@PathVariable String id) {
        try {
            Account account = accountService.getAccount(id);
            BalanceResponse response = new BalanceResponse(
                account.getAccountNumber(),
                account.getAccountNumber(),
                account.getAccountHolderName(),
                account.getBalance().doubleValue(),
                account.getCurrency() != null ? account.getCurrency() : "KES"
            );
            return ResponseEntity.ok(response);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }

    /**
     * Get all accounts (admin endpoint)
     */
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    /**
     * Get a specific account by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccount(@PathVariable String id) {
        try {
            Account account = accountService.getAccount(id);
            return ResponseEntity.ok(account);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
