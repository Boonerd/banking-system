package com.bankapp.banking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    private String id;
    private String accountNumber;
    private String accountHolderName;
    private Double balance;

    public Account(String id, String accountHolderName, Double balance) {
        this.id = id;
        this.accountNumber = "ACC-" + id;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
    }
}
