package com.bankapp.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponse {

    private String accountId;
    private String accountNumber;
    private String accountHolderName;
    private Double balance;
    private String currency;
}