package com.bankapp.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponse {
    private boolean success;
    private String message;
    private String fromAccountId;
    private String toAccountId;
    private Double amount;
    private Double fromAccountNewBalance;
    private Double toAccountNewBalance;
}
