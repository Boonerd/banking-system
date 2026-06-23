import { useState } from 'react';
import axios from 'axios';
import { 
    FiRepeat, FiHome, 
  FiSmartphone, FiInbox, FiCpu, FiGrid, FiEye, FiEyeOff 
} from 'react-icons/fi';

const API_BASE = '/api/accounts';

function DashboardView({ loggedInUser, setLoggedInUser, setMessage, setError, clearMessages }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' or 'transact'
  const [showBalance, setShowBalance] = useState(true);
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
      setMessage(`Successfully sent funds to ${transferTarget}.`);
      setTransferAmount('');
      setTransferTarget('');
      await fetchUpdatedBalance();
    } catch (err) {
      setError(err.response?.data?.message || 'Remittance execution failed.');
    }
  };

  const currencyLabel = loggedInUser?.currency || 'KES';
  const formattedBalance = loggedInUser?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';

  return (
    <div className="mobile-view-container animate-fade-in">
      {/* Top Mobile Profile Banner */}
      <div className="mobile-user-hero">
        <div className="user-meta">
          <div className="avatar-placeholder">
            {loggedInUser.accountHolderName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="greeting-text">Good Afternoon</span>
            <h2 className="profile-name">{loggedInUser.accountHolderName?.toUpperCase()}</h2>
          </div>
        </div>
      </div>

      {/* Tab Panel Content Routing */}
      {activeTab === 'home' && (
        <div className="tab-view animate-fade-in">
          {/* Balance Passport Card */}
          <div className="balance-passport">
            <div className="passport-header">
              <span>Checking Account ({loggedInUser.accountNumber})</span>
              <button className="eye-toggle" onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <strong className="passport-amount">
              {currencyLabel} {showBalance ? formattedBalance : '******'}
            </strong>
            <button className="passport-sync-btn" onClick={fetchUpdatedBalance}>
              Refresh Wallet Balance
            </button>
          </div>

          {/* Feature Highlight Panels */}
          <h3 className="section-title-label">Quick Actions</h3>
          <div className="native-action-grid">
            <div className="action-tile" onClick={() => setActiveTab('transact')}>
              <div className="tile-icon icon-blue"><FiSmartphone /></div>
              <span>Send to Mobile</span>
            </div>
            <div className="action-tile" onClick={() => setActiveTab('transact')}>
              <div className="tile-icon icon-green"><FiRepeat /></div>
              <span>Bank Transfer</span>
            </div>
            <div className="action-tile" onClick={() => handleTransaction('deposit', 'Simulated quick cash flow deposited.')}>
              <div className="tile-icon icon-orange"><FiInbox /></div>
              <span>Instant Deposit</span>
            </div>
            <div className="action-tile" onClick={() => setActiveTab('transact')}>
              <div className="tile-icon icon-purple"><FiCpu /></div>
              <span>Pay Utilities</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transact' && (
        <div className="tab-view animate-fade-in">
          {/* Over-The-Counter Cash Desk */}
          <section className="mobile-card">
            <h3 className="card-title">Vault Cash Desk</h3>
            <div className="field-group">
              <label>Value Amount ({currencyLabel})</label>
              <input type="number" value={otcAmount} onChange={(e) => setOtcAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="button-row-grid">
              <button className="button success" onClick={() => handleTransaction('deposit', 'Deposit processed.')}>Deposit</button>
              <button className="button danger" onClick={() => handleTransaction('withdraw', 'Withdrawal processed.')}>Withdraw</button>
            </div>
          </section>

          {/* Direct Interbank Transfer Form */}
          <section className="mobile-card" style={{ marginTop: '16px' }}>
            <h3 className="card-title">Direct Account Transfer</h3>
            <div className="field-group">
              <label>Target Account Routing ID</label>
              <input type="text" value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} placeholder="e.g. ACC102" />
            </div>
            <div className="field-group">
              <label>Transfer Value ({currencyLabel})</label>
              <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" />
            </div>
            <button className="button warning full-width" onClick={handleTransfer}>Execute Clearing Settlement</button>
          </section>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Dock */}
      <div className="bottom-nav-dock">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <FiHome size={20} />
          <span>Home</span>
        </button>
        <button className={`nav-item ${activeTab === 'transact' ? 'active' : ''}`} onClick={() => setActiveTab('transact')}>
          <FiGrid size={20} />
          <span>Transact</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardView;