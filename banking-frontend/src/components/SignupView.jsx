import { useState } from 'react';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE = '/api/accounts';

function SignupView({ setCurrentView, setMessage, setError, clearMessages }) {
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupCurrency, setSignupCurrency] = useState('KES');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/signup`, {
        name: signupName,
        email: signupEmail,
        phoneNumber: signupPhone,
        pin: signupPin,
        currency: signupCurrency,
        accountType: 'Savings' // Standard default fallback matching your entity
      });
      setCurrentView('LOGIN');
      setMessage('Registration successful! Please sign in.');
      setCurrentView('LOGIN');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Authentication failed.';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-frame animate-fade-in">
      <div className="brand-header">
        <div className="brand-logo">H</div>
        <p>Create your account to get started</p>
      </div>

      <section className="login-sheet">
        <form className="login-form" onSubmit={handleSignup}>
          
          <div className="form-group">
            <label>Full Legal Name</label>
            <input 
              type="text" 
              value={signupName} 
              onChange={(e) => setSignupName(e.target.value)} 
              placeholder="Jane Njeri" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={signupEmail} 
              onChange={(e) => setSignupEmail(e.target.value)} 
              placeholder="Njeri67@mail.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Mobile Phone Number</label>
            <input 
              type="tel" 
              value={signupPhone} 
              onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))} 
              placeholder="0712345678" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Create Secure 4-Digit PIN</label>
            <div className="pin-input-wrapper">
            <input
              type={showPin ? 'text' : 'password'}
              value={signupPin}
              onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              required
            />
            <button type="button" className="eye-toggle" onClick={() => setShowPin(!showPin)}>
              {showPin ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
            </div>
          </div>

          <div className="form-group">
            <label>Settlement Currency</label>
            <select value={signupCurrency} onChange={(e) => setSignupCurrency(e.target.value)}>
              <option value="KES">KES (Kenyan Shilling)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Create Account'}
          </button>
        </form>

        <div className="action-links">
          <button className="btn btn-secondary" onClick={() => { setCurrentView('LOGIN'); clearMessages(); }}>
            Back to Sign In
          </button>
        </div>
      </section>
    </div>
  );
}

export default SignupView;