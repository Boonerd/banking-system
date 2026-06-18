package com.bankapp.banking.model;

import lombok.Data;

@Data
public class Account {

    private String accountNumber;
    private String accountHolderName;
    private Double balance;
}
