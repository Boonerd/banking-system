import { useState } from 'react';
import axios from 'axios';
import { FiDollarSign, FiArrowRight, FiRepeat } from 'react-icons/fi';

const API_BASE = '/api/accounts';

function DashboardView({ loggedInUser, setLoggedInUser, setMessage, setError, clearMessages }) {
  const [otcAmount, setOtcAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  

  const fetchUpdatedBalance = async () => {
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        emailOrPhone: loggedInUser.email,
        pin: '', 
      });
      setLoggedInUser(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Unable to sync running ledger balance.');
    }
  };

  const handleTransaction = async (endpoint, successText) => {
    if (!otcAmount || parseFloat(otcAmount) <= 0) {
      setError('A valid positive transaction amount is required.');
      return;
    }
    clearMessages();
    try {
      await axios.post(`${API_BASE}/${endpoint}`, {
        accountId: loggedInUser.accountNumber,
        amount: parseFloat(otcAmount),
      });
      setMessage(successText);
      setOtcAmount('');
      await fetchUpdatedBalance();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction processing failed.');
    }
  };

  const handleTransfer = async () => {
    if (!transferTarget || !transferAmount || parseFloat(transferAmount) <= 0) {
      setError('Valid target account routing ID and value amount are required.');
      return;
    }
    clearMessages();
    try {
      await axios.post(`${API_BASE}/transfer`, {
        fromAccountId: loggedInUser.accountNumber,
        toAccountId: transferTarget,
        amount: parseFloat(transferAmount),
      });
      setMessage(`Successfully sent funds to clearing layer for destination entity ${transferTarget}.`);
      setTransferAmount('');
      setTransferTarget('');
      await fetchUpdatedBalance();
    } catch (err) {
      setError(err.response?.data?.message || 'Remittance execution failed.');
    }
  };

  const maskPhoneNumber = (p) => p && p.length > 4 ? '*'.repeat(p.length - 4) + p.slice(-4) : p;
  const currencyLabel = loggedInUser?.currency || 'KES';
  const formattedBalance = loggedInUser?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';

  return (
    <main className="dashboard-grid animate-fade-in">
      <section className="wallet-panel glass-card">
        <div className="section-heading compact">
          <span className="section-icon secondary"><FiDollarSign /></span>
          <div>
            <h2>Liquid Asset Summary</h2>
            <p>Balances across linked clearance contracts.</p>
          </div>
        </div>

        <div className="wallet-balance">
          <span>Available Balance</span>
          <strong className="balance-text">{formattedBalance} {currencyLabel}</strong>
        </div>

        <div className="wallet-details">
          <div><span>Account Holder</span><strong>{loggedInUser.accountHolderName}</strong></div>
          <div><span>Account Routing ID</span><strong>{loggedInUser.accountNumber}</strong></div>
          <div><span>Registered Contact</span><strong>{maskPhoneNumber(loggedInUser.phoneNumber)}</strong></div>
          <div><span>Base Currency</span><strong>{currencyLabel}</strong></div>
        </div>

        <button className="button primary sync-btn" onClick={fetchUpdatedBalance}>
          <FiArrowRight /> Sync Ledger Balance
        </button>
      </section>

      <div className="actions-column">
        <section className="glass-card action-card">
          <div className="section-heading compact">
            <span className="section-icon"><FiDollarSign /></span>
            <div>
              <h2>Over-The-Counter Engine</h2>
              <p>Simulate immediate vault deposits or cash clearings.</p>
            </div>
          </div>
          <div className="field-group">
            <label>Transaction Amount ({currencyLabel})</label>
            <input type="number" value={otcAmount} onChange={(e) => setOtcAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="button-row-grid">
            <button className="button success" onClick={() => handleTransaction('deposit', 'Deposit clearance processed instantly.')}>Deposit Funds</button>
            <button className="button danger" onClick={() => handleTransaction('withdraw', 'Withdrawal settlement processed.')}>Withdraw Funds</button>
          </div>
        </section>

        <section className="glass-card action-card">
          <div className="section-heading compact">
            <span className="section-icon warning"><FiRepeat /></span>
            <div>
              <h2>Cross-Account Remittance</h2>
              <p>Route clearing payments instantly to external wallets.</p>
            </div>
          </div>
          <div className="field-group">
            <label>Recipient Target Routing ID</label>
            <input type="text" value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} placeholder="e.g. ACC102" />
          </div>
          <div className="field-group">
            <label>Transfer Value ({currencyLabel})</label>
            <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" />
          </div>
          <button className="button warning full-width" onClick={handleTransfer}>Execute Clearing Settlement</button>
        </section>
      </div>
    </main>
  );
}

export default DashboardView;