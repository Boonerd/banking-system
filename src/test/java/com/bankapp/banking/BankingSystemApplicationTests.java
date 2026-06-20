package com.bankapp.banking;

import com.bankapp.banking.exception.InsufficientFundsException;
import com.bankapp.banking.model.Account;
import com.bankapp.banking.service.AccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BankingSystemApplicationTests {

	@Autowired
	private AccountService accountService;

	private String account1Id;
	private String account2Id;

	@BeforeEach
	void setUp() {
		// Create test accounts
		Account acc1 = accountService.createAccount("Alice Johnson", 1000.0);
		Account acc2 = accountService.createAccount("Bob Smith", 500.0);
		account1Id = acc1.getId();
		account2Id = acc2.getId();
	}

	@Test
	void contextLoads() {
		assertNotNull(accountService);
	}

	// Test 1: Deposit Operation
	@Test
	void testDeposit() {
		Double initialBalance = accountService.getBalance(account1Id);
		Account updatedAccount = accountService.deposit(account1Id, 200.0);

		assertEquals(1200.0, updatedAccount.getBalance());
		assertEquals(1200.0, accountService.getBalance(account1Id));
	}

	@Test
	void testDepositNegativeAmount() {
		assertThrows(IllegalArgumentException.class, () -> {
			accountService.deposit(account1Id, -100.0);
		});
	}

	@Test
	void testDepositZeroAmount() {
		assertThrows(IllegalArgumentException.class, () -> {
			accountService.deposit(account1Id, 0.0);
		});
	}

	// Test 2: Withdrawal Operation
	@Test
	void testWithdraw() {
		Account updatedAccount = accountService.withdraw(account1Id, 300.0);

		assertEquals(700.0, updatedAccount.getBalance());
		assertEquals(700.0, accountService.getBalance(account1Id));
	}

	@Test
	void testWithdrawInsufficientFunds() {
		assertThrows(InsufficientFundsException.class, () -> {
			accountService.withdraw(account1Id, 2000.0);
		}, "Should throw InsufficientFundsException when balance is insufficient");
	}

	@Test
	void testWithdrawNegativeAmount() {
		assertThrows(IllegalArgumentException.class, () -> {
			accountService.withdraw(account1Id, -50.0);
		});
	}

	@Test
	void testWithdrawExactBalance() {
		accountService.withdraw(account2Id, 500.0);
		assertEquals(0.0, accountService.getBalance(account2Id));
	}

	// Test 3: Transfer Operation
	@Test
	void testTransfer() {
		accountService.transfer(account1Id, account2Id, 300.0);

		assertEquals(700.0, accountService.getBalance(account1Id));
		assertEquals(800.0, accountService.getBalance(account2Id));
	}

	@Test
	void testTransferInsufficientFunds() {
		assertThrows(InsufficientFundsException.class, () -> {
			accountService.transfer(account2Id, account1Id, 1000.0);
		}, "Should throw InsufficientFundsException when source account has insufficient funds");
	}

	@Test
	void testTransferToSameAccount() {
		assertThrows(IllegalArgumentException.class, () -> {
			accountService.transfer(account1Id, account1Id, 100.0);
		}, "Should not allow transfer to the same account");
	}

	@Test
	void testTransferNegativeAmount() {
		assertThrows(IllegalArgumentException.class, () -> {
			accountService.transfer(account1Id, account2Id, -100.0);
		});
	}

	@Test
	void testTransferZeroAmount() {
		assertThrows(IllegalArgumentException.class, () -> {
			accountService.transfer(account1Id, account2Id, 0.0);
		});
	}

	// Test 4: Get Balance
	@Test
	void testGetBalance() {
		Double balance = accountService.getBalance(account1Id);
		assertEquals(1000.0, balance);
	}

	@Test
	void testGetBalanceAfterMultipleTransactions() {
		accountService.deposit(account1Id, 500.0);
		accountService.withdraw(account1Id, 200.0);
		accountService.transfer(account1Id, account2Id, 300.0);

		assertEquals(1000.0, accountService.getBalance(account1Id));
		assertEquals(800.0, accountService.getBalance(account2Id));
	}

	// Integration Tests
	@Test
	void testCompleteScenario() {
		// Initial state
		assertEquals(1000.0, accountService.getBalance(account1Id));
		assertEquals(500.0, accountService.getBalance(account2Id));

		// Alice deposits $200
		accountService.deposit(account1Id, 200.0);
		assertEquals(1200.0, accountService.getBalance(account1Id));

		// Alice transfers $400 to Bob
		accountService.transfer(account1Id, account2Id, 400.0);
		assertEquals(800.0, accountService.getBalance(account1Id));
		assertEquals(900.0, accountService.getBalance(account2Id));

		// Bob withdraws $250
		accountService.withdraw(account2Id, 250.0);
		assertEquals(650.0, accountService.getBalance(account2Id));

		// Final state verification
		assertEquals(800.0, accountService.getBalance(account1Id));
		assertEquals(650.0, accountService.getBalance(account2Id));
	}

	@Test
	void testAccountCreation() {
		Account account = accountService.createAccount("Charlie Brown", 750.0);

		assertNotNull(account.getId());
		assertEquals("Charlie Brown", account.getAccountHolderName());
		assertEquals(750.0, account.getBalance());
		assertTrue(account.getAccountNumber().startsWith("ACC-"));
	}
}
