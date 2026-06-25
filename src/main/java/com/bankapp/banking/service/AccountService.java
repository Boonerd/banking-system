package com.bankapp.banking.service;

import com.bankapp.banking.entity.Account;
import com.bankapp.banking.exception.AccountNotFoundException;
import com.bankapp.banking.exception.InsufficientFundsException;
import com.bankapp.banking.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Account createAccount(String name, String email, String phoneNumber, String rawPin, BigDecimal balance, String currency) {
        String accountNumber = generateUniqueAccountNumber();
        String hashedPin = passwordEncoder.encode(rawPin);
        Account account = new Account(accountNumber, name, email, phoneNumber, hashedPin, balance, "CONSUMER", currency);
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        return accountRepository.save(account);
    }

    public Account getAccount(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
    }

    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public Optional<Account> findByPhoneNumber(String phoneNumber) {
        return accountRepository.findByPhoneNumber(phoneNumber);
    }

    public boolean verifyPin(Account account, String rawPin) {
        return passwordEncoder.matches(rawPin, account.getPin());
    }

    public Double getBalance(String accountNumber) {
        return getAccount(accountNumber).getBalance().doubleValue();
    }

    public Account deposit(String accountNumber, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }

        Account account = getAccount(accountNumber);
        synchronized (account) {
            account.setBalance(account.getBalance().add(BigDecimal.valueOf(amount)));
            account.setUpdatedAt(LocalDateTime.now());
        }
        return accountRepository.save(account);
    }

    public Account withdraw(String accountNumber, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }

        Account account = getAccount(accountNumber);
        synchronized (account) {
            if (account.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
                throw new InsufficientFundsException(
                    "Insufficient funds. Available: " + account.getBalance() + ", Requested: " + amount
                );
            }
            account.setBalance(account.getBalance().subtract(BigDecimal.valueOf(amount)));
            account.setUpdatedAt(LocalDateTime.now());
        }
        return accountRepository.save(account);
    }

    public void transfer(String fromAccountNumber, String toAccountNumber, Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        if (fromAccountNumber.equals(toAccountNumber)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account fromAccount = getAccount(fromAccountNumber);
        Account toAccount = getAccount(toAccountNumber);

        synchronized (fromAccount) {
            synchronized (toAccount) {
                if (fromAccount.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
                    throw new InsufficientFundsException(
                        "Insufficient funds in source account. Available: " + fromAccount.getBalance() + ", Requested: " + amount
                    );
                }
                fromAccount.setBalance(fromAccount.getBalance().subtract(BigDecimal.valueOf(amount)));
                fromAccount.setUpdatedAt(LocalDateTime.now());

                toAccount.setBalance(toAccount.getBalance().add(BigDecimal.valueOf(amount)));
                toAccount.setUpdatedAt(LocalDateTime.now());
            }
        }
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "ACC" + (100 + random.nextInt(900));
        } while (accountRepository.findByAccountNumber(accountNumber).isPresent());
        return accountNumber;
    }

    public Account createAccount(String string, double d) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createAccount'");
    }

    public Account deposit(String accountId, BigDecimal valueOf) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deposit'");
    }
}
