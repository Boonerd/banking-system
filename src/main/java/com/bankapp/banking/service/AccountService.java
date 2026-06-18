package com.bankapp.banking.service;

import com.bankapp.banking.model.Account;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private final List<Account> accounts = Collections.synchronizedList(new ArrayList<>());

    public Account createAccount(String name, Double balance) {
        String accountNumber = UUID.randomUUID().toString();
        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setAccountHolderName(name);
        account.setBalance(balance);
        accounts.add(account);
        return account;
    }

    public List<Account> getAllAccounts() {
        return accounts;
    }
}
