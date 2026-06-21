import { useState } from 'react';
import axios from 'axios';
import { FiShield } from 'react-icons/fi';

const API_BASE = '/api/accounts';

function LoginView({ setLoggedInUser, setCurrentView, setMessage, setError, clearMessages }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPin) {
      setError('Email/Phone and PIN are required.');
      return;
    }
    clearMessages();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        emailOrPhone: loginEmail,
        pin: loginPin,
      });
      setLoggedInUser(response.data);
      setCurrentView('DASHBOARD');
      setMessage('Login successful. Welcome back!');
    } catch (err) {
      setError(err.response?.data || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-gateway animate-fade-in">
      <section className="login-card glass-card">
        <div className="section-heading compact">
          <span className="section-icon secondary"><FiShield /></span>
          <div>
            <h2>Secure Identity Login</h2>
            <p>Access your consumer dashboard using your credentials.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="field-group">
            <label>Email Address or Mobile Number</label>
            <input
              type="text"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="alice@mail.com or 0712345678"
              required
            />
          </div>

          <div className="field-group">
            <label>Secure 4-Digit Passcode PIN</label>
            <input
              type="password"
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>

          <button type="submit" className="button primary" disabled={loading}>
            {loading ? 'Authenticating Secure Session...' : 'Sign In to Secure Session'}
          </button>
        </form>

        <div className="auth-link">
          <p>Don't have an account? <button className="link-button" onClick={() => { setCurrentView('SIGNUP'); clearMessages(); }}>Open an account here</button></p>
        </div>
      </section>
    </div>
  );
}

export default LoginView;