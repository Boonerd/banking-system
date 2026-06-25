import { useState } from 'react';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const API_BASE = '/api/accounts';



function LoginView({ setLoggedInUser, setCurrentView, setMessage, setError, clearMessages }) {
  const [phone, setPhone] = useState('');
  const [pin, setPIN] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !pin) {
      setError('Mobile number and PIN are required.');
      return;
    }
    clearMessages();
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        emailOrPhone: phone,
        pin: pin,
      });
      setLoggedInUser(response.data);
      setCurrentView('DASHBOARD');
      setMessage('Welcome back!');
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
        
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>
      </div>

      <section className="login-sheet">
        <form className="login-form" onSubmit={handleLogin}>
          
          <div className="form-group">
            <label>Mobile Number</label>
            <div className="prefix-input-container">
              {/* <span className="phone-prefix">+254</span> */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0712345678"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>4-Digit PIN</label>
            <div className="pin-input-wrapper">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPIN(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
              maxLength={4}
              required
            />
            <button
              type="button"
              className="pin-toggle-btn"
              onClick={() => setShowPin(!showPin)}
              tabIndex={-1}
            >
              {showPin ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>
        

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Sign In'}
          </button>
        </form>
        

        <div className="action-links">
          <button className="btn btn-secondary" onClick={() => { setCurrentView('SIGNUP'); clearMessages(); }}>
            Create an Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default LoginView;