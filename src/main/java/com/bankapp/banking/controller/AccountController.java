package com.bankapp.banking.controller;

import com.bankapp.banking.dto.BalanceResponse;
import com.bankapp.banking.dto.TransactionRequest;
import com.bankapp.banking.dto.TransactionResponse;
import com.bankapp.banking.dto.TransferRequest;
import com.bankapp.banking.dto.TransferResponse;
import com.bankapp.banking.exception.AccountNotFoundException;
import com.bankapp.banking.exception.InsufficientFundsException;
import com.bankapp.banking.model.Account;
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
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestParam String name, @RequestParam Double balance) {
        Account account = accountService.createAccount(name, balance);
        return ResponseEntity.status(HttpStatus.CREATED).body(account);
    }

    /**
     * Endpoint 1: Deposit money into an account
     * POST /api/accounts/deposit
     */
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody TransactionRequest request) {
        try {
            Account account = accountService.deposit(request.getAccountId(), request.getAmount());
            TransactionResponse response = new TransactionResponse(
                true,
                "Deposit successful",
                request.getAccountId(),
                account.getBalance(),
                "DEPOSIT"
            );
            return ResponseEntity.ok(response);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "DEPOSIT"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "DEPOSIT"));
        }
    }

    /**
     * Endpoint 2: Withdraw money from an account
     * POST /api/accounts/withdraw
     */
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody TransactionRequest request) {
        try {
            Account account = accountService.withdraw(request.getAccountId(), request.getAmount());
            TransactionResponse response = new TransactionResponse(
                true,
                "Withdrawal successful",
                request.getAccountId(),
                account.getBalance(),
                "WITHDRAWAL"
            );
            return ResponseEntity.ok(response);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new TransactionResponse(false, e.getMessage(), null, null, "WITHDRAWAL"));
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
            
            Account fromAccount = accountService.getAccount(request.getFromAccountId());
            Account toAccount = accountService.getAccount(request.getToAccountId());
            
            TransferResponse response = new TransferResponse(
                true,
                "Transfer successful",
                request.getFromAccountId(),
                request.getToAccountId(),
                request.getAmount(),
                fromAccount.getBalance(),
                toAccount.getBalance()
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
            Double balance = accountService.getBalance(id);
            BalanceResponse response = new BalanceResponse(id, balance);
            return ResponseEntity.ok(response);
        } catch (AccountNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new BalanceResponse(id, null));
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
