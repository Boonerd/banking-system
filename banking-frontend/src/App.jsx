import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import DashboardView from './components/DashboardView';
import SplashScreen from './components/SplashScreen';
import { FiCheckCircle, FiAlertTriangle, FiX, FiMoon, FiSun } from 'react-icons/fi';
import './App.css';

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('LOGIN');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // Controls the sliding side settings drawer

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  useEffect(() => {
    // Brief simulated loading period for the app shell
    const timer = setTimeout(() => setAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <SplashScreen />;
  }

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : 'light-mode'}`}>

      {/* Slide-out Settings Menu Drawer Overlay */}
      <div className={`side-nav-drawer ${menuOpen ? '' : 'hidden'}`}>
        <div className="nav-header">
          <h3>System Settings</h3>
          <button className="menu-trigger-btn" onClick={() => setMenuOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <div className="nav-menu-list">
          {/* Functional Theme Toggler Row */}
          <button className="nav-item" onClick={() => setDarkMode(!darkMode)}>
            <span>Display Mode</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {darkMode ? <FiMoon size={14} /> : <FiSun size={14} />}
              {darkMode ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* Secure Placeholder Rows */}
          <button className="nav-item" onClick={() => alert('Security & Session Keys are automatically managed.')}>
            <span>🔒 Security & Keys</span>
          </button>

          <button className="nav-item" onClick={() => alert('System localized to English (EN).')}>
            <span>🌐 Region / Language</span>
          </button>
        </div>
      </div>

      <div className="wide-app-container">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          setCurrentView={setCurrentView}
          onOpenSettings={() => setMenuOpen(true)}
        />

        {message && (
          <div className="notice success animate-fade-in">
            <FiCheckCircle size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="notice error animate-fade-in">
            <FiAlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {currentView === 'LOGIN' && (
          <LoginView
            setLoggedInUser={setLoggedInUser}
            setCurrentView={setCurrentView}
            setMessage={setMessage}
            setError={setError}
            clearMessages={clearMessages}
          />
        )}

        {currentView === 'SIGNUP' && (
          <SignupView
            setLoggedInUser={setLoggedInUser}
            setCurrentView={setCurrentView}
            setMessage={setMessage}
            setError={setError}
            clearMessages={clearMessages}
          />
        )}

        {currentView === 'DASHBOARD' && loggedInUser && (
          <DashboardView
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
            setMessage={setMessage}
            setError={setError}
            clearMessages={clearMessages}
          />
        )}
      </div>
    </div>
  );
}

export default App;