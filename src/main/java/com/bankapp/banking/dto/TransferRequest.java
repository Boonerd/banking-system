package com.bankapp.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
    private String fromAccountId;
    private String toAccountId;
    private Double amount;
}
