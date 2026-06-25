import { useState } from 'react';
import axios from 'axios';
import { 
  FiRepeat, FiHome, 
  FiSmartphone, FiInbox, FiCpu, FiGrid, FiEye, FiEyeOff 
} from 'react-icons/fi';

const API_BASE = '/api/accounts';

function DashboardView({ loggedInUser, setLoggedInUser, setMessage, setError, clearMessages }) {
  const [activeTab, setActiveTab] = useState('home'); 
  const [showBalance, setShowBalance] = useState(true);
  const [otcAmount, setOtcAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  const [transactionMethod, setTransactionMethod] = useState('MOBILE_MONEY');

  // FIX: Checks the dedicated balance path by ID instead of hitting /login with a blank PIN
  const fetchUpdatedBalance = async () => {
    try {
      const response = await axios.get(`${API_BASE}/${loggedInUser.id}/balance`);
      setLoggedInUser(prev => ({
        ...prev,
        balance: response.data.balance
      }));
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Unable to sync running balance.');
    }
  };

  const handleTransaction = async (endpoint, successText) => {
    if (!otcAmount || parseFloat(otcAmount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    clearMessages();
    try {
      await axios.post(`${API_BASE}/${endpoint}`, {
        accountId: loggedInUser.id, 
        amount: parseFloat(otcAmount),
        method: transactionMethod
      });
      setMessage(successText);
      setOtcAmount('');
      await fetchUpdatedBalance();
    } catch (err) {
      setError(err.response?.data || 'Transaction failed.');
    }
  };

  const handleTransfer = async () => {
    if (!transferTarget || !transferAmount || parseFloat(transferAmount) <= 0) {
      setError('Recipient account and a valid amount are required.');
      return;
    }
    clearMessages();
    try {
      await axios.post(`${API_BASE}/transfer`, {
        fromAccountId: loggedInUser.id,
        toAccountId: transferTarget,
        amount: parseFloat(transferAmount),
      });
      setMessage(`Sent safely to ${transferTarget}.`);
      setTransferAmount('');
      setTransferTarget('');
      await fetchUpdatedBalance();
    } catch (err) {
      setError(err.response?.data || 'Transfer execution failed.');
    }
  };

  const currencyLabel = loggedInUser?.currency || 'KES';
  const formattedBalance = loggedInUser?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00';

  return (
    <div className="mobile-frame animate-fade-in">
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
              Refresh Balance
            </button>
          </div>

          <h3 className="section-title-label">Quick Actions</h3>
          <div className="native-action-grid">
            <div className="action-tile" onClick={() => { setActiveTab('transact'); setTransactionMethod('MOBILE_MONEY'); }}>
              <div className="tile-icon icon-blue"><FiSmartphone /></div>
              <span>Send to Mobile</span>
            </div>
            <div className="action-tile" onClick={() => setActiveTab('transact')}>
              <div className="tile-icon icon-green"><FiRepeat /></div>
              <span>Bank Transfer</span>
            </div>
            <div className="action-tile" onClick={() => { setActiveTab('transact'); setTransactionMethod('ATM'); }}>
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
          {/* Move Funds Component Panel */}
          <section className="compact-transact-card">
            <div className="sheet-header">
              <h3>Move Funds</h3>
              <p>Transfer across local networks instantly</p>
            </div>

            <div className="input-compact-group">
              <label>Transaction Channel</label>
              <select 
                value={transactionMethod} 
                onChange={(e) => setTransactionMethod(e.target.value)} 
                className="slick-select"
              >
                <option value="MOBILE_MONEY">Mobile Money (M-Pesa / Airtel Money)</option>
                <option value="ATM">ATM Agent Cash Desk</option>
                <option value="CARD">Linked Debit Card (Visa / Mastercard)</option>
              </select>
            </div>

            <div className="input-compact-group">
              <label>Value Amount ({currencyLabel})</label>
              <input 
                type="number" 
                value={otcAmount} 
                onChange={(e) => setOtcAmount(e.target.value)} 
                placeholder="0.00" 
                className="slick-amount-input"
              />
            </div>

            <div className="action-button-row">
              <button className="btn-action btn-deposit" onClick={() => handleTransaction('deposit', `Deposited ${currencyLabel} ${otcAmount} successfully.`)}>
                Deposit
              </button>
              <button className="btn-action btn-withdraw" onClick={() => handleTransaction('withdraw', `Withdrew ${currencyLabel} ${otcAmount} successfully.`)}>
                Withdraw
              </button>
            </div>
          </section>

          {/* Direct Interbank Transfer Form */}
          <section className="compact-transact-card" style={{ marginTop: '14px' }}>
            <div className="sheet-header">
              <h3>Direct Account Transfer</h3>
              <p>Send cleared funds straight to another wallet account</p>
            </div>
            
            <div className="input-compact-group">
              <label>Recipient Account Number</label>
              <input type="text" value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} placeholder="e.g. 1234567890" className="slick-select" />
            </div>
            <div className="input-compact-group">
              <label>Transfer Value ({currencyLabel})</label>
              <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" className="slick-amount-input" />
            </div>
            <button className="btn-action btn-deposit" style={{ width: '100%', marginTop: '8px' }} onClick={handleTransfer}>
              Confirm & Clear Transfer
            </button>
          </section>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Dock */}
      <div className="bottom-nav-dock">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <FiHome size={18} />
          <span>Home</span>
        </button>
        <button className={`nav-item ${activeTab === 'transact' ? 'active' : ''}`} onClick={() => setActiveTab('transact')}>
          <FiGrid size={18} />
          <span>Transact</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardView;