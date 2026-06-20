import React, { useState } from 'react';
import axios from 'axios';

// Set the base URL pointing to your Spring Boot Backend
const API_BASE = 'http://localhost:8080/api/accounts';

function App() {
  const [accountId, setAccountId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  // 1. Check Balance
  const checkBalance = async () => {
    if (!accountId) return setError('Please enter an Account ID');
    clearMessages();
    try {
      const response = await axios.get(`${API_BASE}/${accountId}/balance`);
      setBalance(response.data);
      setMessage(`Balance fetched successfully!`);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch balance. Ensure backend is running.');
    }
  };

  // 2. Deposit
  const handleDeposit = async () => {
    if (!accountId || !amount) return setError('Account ID and Amount are required');
    clearMessages();
    try {
      await axios.post(`${API_BASE}/deposit`, { accountId, amount: parseFloat(amount) });
      setMessage(`Successfully deposited $${amount}`);
      setAmount('');
      checkBalance(); // Refresh balance automatically
    } catch (err) {
      setError(err.response?.data || 'Deposit failed.');
    }
  };

  // 3. Withdraw
  const handleWithdraw = async () => {
    if (!accountId || !amount) return setError('Account ID and Amount are required');
    clearMessages();
    try {
      await axios.post(`${API_BASE}/withdraw`, { accountId, amount: parseFloat(amount) });
      setMessage(`Successfully withdrew $${amount}`);
      setAmount('');
      checkBalance(); // Refresh balance automatically
    } catch (err) {
      setError(err.response?.data || 'Withdrawal failed.');
    }
  };

  // 4. Transfer (Send Money)
  const handleTransfer = async () => {
    if (!accountId || !targetId || !amount) return setError('Source ID, Target ID, and Amount are required');
    clearMessages();
    try {
      await axios.post(`${API_BASE}/transfer`, { 
        sourceAccountId: accountId, 
        targetAccountId: targetId, 
        amount: parseFloat(amount) 
      });
      setMessage(`Successfully transferred $${amount} to Account ${targetId}`);
      setAmount('');
      setTargetId('');
      checkBalance(); // Refresh balance automatically
    } catch (err) {
      setError(err.response?.data || 'Transfer failed.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Nesti Core Banking Simulator</h2>
      
      {/* Alert Messages */}
      {message && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}
      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      {/* Account Context Selection */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <h3>1. Account Setup</h3>
        <label>Your Account ID: </label>
        <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="e.g., ACC123" style={{ padding: '8px', width: '60%', marginRight: '10px' }} />
        <button onClick={checkBalance} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Check Balance</button>
        
        {balance !== null && <h4 style={{ marginTop: '10px', color: '#28a745' }}>Current Balance: ${balance}</h4>}
      </div>

      {/* Transactions Section */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '6px' }}>
        <h3>2. Transact (Deposit / Withdraw)</h3>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" style={{ padding: '8px', width: '40%', marginRight: '10px' }} />
        <button onClick={handleDeposit} style={{ padding: '8px 12px', marginRight: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Deposit</button>
        <button onClick={handleWithdraw} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Withdraw</button>
      </div>

      {/* Transfer Section */}
      <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '6px' }}>
        <h3>3. Transfer Funds</h3>
        <input type="text" value={targetId} onChange={(e) => setTargetId(e.target.value)} placeholder="Recipient Account ID" style={{ padding: '8px', width: '40%', marginRight: '10px', marginBottom: '10px' }} />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" style={{ padding: '8px', width: '40%', marginRight: '10px' }} />
        <button onClick={handleTransfer} style={{ padding: '8px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Send Money</button>
      </div>
    </div>
  );
}

export default App;