import { FiCreditCard, FiSun, FiMoon, FiUsers, FiLogOut } from 'react-icons/fi';

const BRAND_NAME = 'Horizon Bank';

function Navbar({ darkMode, setDarkMode, loggedInUser, setLoggedInUser, setCurrentView }) {
  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView('LOGIN');
  };

  return (
    <header className="topbar glass-card">
      <div className="brand-block">
        <div className="brand-badge">
          <FiCreditCard size={22} />
        </div>
        <div>
          <h1>{BRAND_NAME}</h1>
          <p className="subtext">Premium digital retail banking simulator.</p>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />} 
          <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
        </button>
        
        {loggedInUser && (
          <div className="profile-block">
            <div className="profile-badge">
              <FiUsers size={16} />
              <div>
                <span>Logged in as</span>
                <strong>{loggedInUser.accountHolderName}</strong>
              </div>
            </div>
            <button className="button outline logout-button" onClick={handleLogout}>
              <FiLogOut size={16} /> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;