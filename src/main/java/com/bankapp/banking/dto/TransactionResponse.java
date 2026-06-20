package com.bankapp.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private boolean success;
    private String message;
    private String accountId;
    private Double newBalance;
    private String transactionType;
}
