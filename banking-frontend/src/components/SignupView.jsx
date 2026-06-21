import { useState } from 'react';
import axios from 'axios';
import { FiUserPlus } from 'react-icons/fi';

const API_BASE = '/api/accounts';

function SignupView({ setLoggedInUser, setCurrentView, setMessage, setError, clearMessages }) {
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupCurrency, setSignupCurrency] = useState('KES');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPhone || !signupPin) {
      setError('All fields are required.');
      return;
    }
    if (signupPin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    clearMessages();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/signup`, {
        name: signupName,
        email: signupEmail,
        phoneNumber: signupPhone,
        pin: signupPin,
        currency: signupCurrency,
      });
      setLoggedInUser(response.data);
      setCurrentView('DASHBOARD');
      setMessage('Account created successfully. Welcome!');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-gateway animate-fade-in">
      <section className="login-card glass-card">
        <div className="section-heading compact">
          <span className="section-icon secondary"><FiUserPlus /></span>
          <div>
            <h2>Digital Registration</h2>
            <p>Create a secure digital checking ledger profile.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSignup}>
          <div className="field-group">
            <label>Full Legal Name</label>
            <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" required />
          </div>

          <div className="field-group">
            <label>Email Address</label>
            <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="john@mail.com" required />
          </div>

          <div className="field-group">
            <label>Mobile Phone Number</label>
            <input type="tel" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} placeholder="0712345678" required />
          </div>

          <div className="field-group">
            <label>Create Secure 4-Digit PIN</label>
            <input
              type="password"
              value={signupPin}
              onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>

          <div className="field-group">
            <label>Settlement Currency</label>
            <select value={signupCurrency} onChange={(e) => setSignupCurrency(e.target.value)}>
              <option value="KES">KES (Kenyan Shilling)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>

          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Processing Provisioning...' : 'Provision New Account'}
          </button>
        </form>

        <div className="auth-link">
          <p>Already have an active account? <button className="link-button" onClick={() => { setCurrentView('LOGIN'); clearMessages(); }}>Sign in here</button></p>
        </div>
      </section>
    </div>
  );
}

export default SignupView;