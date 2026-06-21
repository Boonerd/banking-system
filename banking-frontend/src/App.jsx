import { useState } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import DashboardView from './components/DashboardView';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('LOGIN');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="wide-app-container">
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          loggedInUser={loggedInUser} 
          setLoggedInUser={setLoggedInUser} 
          setCurrentView={setCurrentView} 
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