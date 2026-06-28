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
                BigDecimal transferAmount = BigDecimal.valueOf(amount);

                BigDecimal convertedAmount = convertCurrency(
                    transferAmount,
                    fromAccount.getCurrency(),
                    toAccount.getCurrency()
                );

                // Debit sender in their own currency
                fromAccount.setBalance(
                    fromAccount.getBalance().subtract(transferAmount)
                );
                fromAccount.setUpdatedAt(LocalDateTime.now());

                // Credit receiver in THEIR currency
                toAccount.setBalance(
                    toAccount.getBalance().add(convertedAmount)
                );
                toAccount.setUpdatedAt(LocalDateTime.now()); 

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

    private BigDecimal convertCurrency(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount;
        }
        // Hard-coded exchange rates (for demo purposes)
        double rate;

        switch (fromCurrency.toUpperCase() + "_" + toCurrency.toUpperCase()) {
            case "EUR_USD":
                rate = 1.17;
                break;

            case "USD_EUR":
                rate = 0.85;
                break;

                case "KES_USD":
                    rate = 0.0077;
                    break;

                    case "USD_KES":
                        rate = 129.87;
                        break;

                        case "EUR_KES":
                            rate = 152.00;
                            break;

                            case "KES_EUR":
                                rate = 0.0066;
                                break;

            default:
                throw new IllegalArgumentException(
                    "Currency conversion not supported: "
                    + fromCurrency + " -> " + toCurrency
                );
            }
        return amount.multiply(BigDecimal.valueOf(rate));
            }


    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "ACC" + (100 + random.nextInt(900));
        } while (accountRepository.findByAccountNumber(accountNumber).isPresent());
        return accountNumber;
    }

}
