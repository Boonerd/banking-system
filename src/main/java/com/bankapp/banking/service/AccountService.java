package com.bankapp.banking.service;

import com.bankapp.banking.exception.AccountNotFoundException;
import com.bankapp.banking.exception.InsufficientFundsException;
import com.bankapp.banking.model.Account;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AccountService {

    private final Map<String, Account> accounts = new HashMap<>();

    /**
     * Create a new account with initial balance
     */
    public Account createAccount(String name, Double balance) {
        String accountId = UUID.randomUUID().toString().substring(0, 8);
        Account account = new Account(accountId, name, balance);
        accounts.put(accountId, account);
        return account;
    }

    /**
     * Get account by ID
     */
    public Account getAccount(String accountId) {
        Account account = accounts.get(accountId);
        if (account == null) {
            throw new AccountNotFoundException("Account not found: " + accountId);
        }
        return account;
    }

    /**
     * Get current balance for an account
     */
    public Double getBalance(String accountId) {
        return getAccount(accountId).getBalance();
    }

    /**
     * Deposit money into an account
     */
    public Account deposit(String accountId, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        
        Account account = getAccount(accountId);
        synchronized (account) {
            account.setBalance(account.getBalance() + amount);
        }
        return account;
    }

    /**
     * Withdraw money from an account
     */
    public Account withdraw(String accountId, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        
        Account account = getAccount(accountId);
        synchronized (account) {
            if (account.getBalance() < amount) {
                throw new InsufficientFundsException(
                    "Insufficient funds. Available: " + account.getBalance() + ", Requested: " + amount
                );
            }
            account.setBalance(account.getBalance() - amount);
        }
        return account;
    }

    /**
     * Transfer money from one account to another
     */
    public void transfer(String fromAccountId, String toAccountId, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account fromAccount = getAccount(fromAccountId);
        Account toAccount = getAccount(toAccountId);

        // Synchronize on both accounts to avoid race conditions
        synchronized (fromAccount) {
            synchronized (toAccount) {
                if (fromAccount.getBalance() < amount) {
                    throw new InsufficientFundsException(
                        "Insufficient funds in source account. Available: " + fromAccount.getBalance() + 
                        ", Requested: " + amount
                    );
                }
                fromAccount.setBalance(fromAccount.getBalance() - amount);
                toAccount.setBalance(toAccount.getBalance() + amount);
            }
        }
    }

    /**
     * Get all accounts (for admin purposes)
     */
    public List<Account> getAllAccounts() {
        return List.copyOf(accounts.values());
    }
}
