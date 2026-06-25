import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import DashboardView from './components/DashboardView';
import SplashScreen from './components/SplashScreen';
import { FiCheckCircle, FiAlertTriangle, FiX, FiMoon, FiSun } from 'react-icons/fi';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('SPLASH');
  const [darkMode, setDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  // Human Auto-Timeout Hook for global banners (4 seconds)
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : 'light-mode'}`}>

      {/* 1. Clear, Unlocked Full-Screen Splash Overlay Routing */}
      {currentView === 'SPLASH' && (
        <SplashScreen onComplete={() => setCurrentView('LOGIN')} />
      )}

      {/* Slide-out Settings Menu Drawer Overlay */}
      <div className={`side-nav-drawer ${menuOpen ? '' : 'hidden'}`}>
        <div className="nav-header">
          <h3>System Settings</h3>
          <button className="menu-trigger-btn" onClick={() => setMenuOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <div className="nav-menu-list">
          <button className="nav-item" onClick={() => setDarkMode(!darkMode)}>
            <span>Display Mode</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {darkMode ? <FiMoon size={14} /> : <FiSun size={14} />}
              {darkMode ? 'Dark' : 'Light'}
            </span>
          </button>

          <button className="nav-item" onClick={() => alert('Security & Session Keys are automatically managed.')}>
            <span>🔒 Security & Keys</span>
          </button>

          <button className="nav-item" onClick={() => alert('System localized to English (EN).')}>
            <span>🌐 Region / Language</span>
          </button>
        </div>
      </div>

      {/* Only show the full application container structure if the splash is completed */}
      {currentView !== 'SPLASH' && (
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
      )}
    </div>
  );
}

export default App;