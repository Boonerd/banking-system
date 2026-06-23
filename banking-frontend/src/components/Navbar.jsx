import { FiUsers, FiLogOut, FiSettings } from 'react-icons/fi';

function Navbar({ loggedInUser, setLoggedInUser, setCurrentView, onOpenSettings }) {
  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView('LOGIN');
  };

  return (
    <header className="topbar glass-card">
      <div className="brand-mark">H</div>

      <div className="topbar-actions">
        <button className="theme-toggle-btn" onClick={onOpenSettings} title="Settings">
          <FiSettings size={16} />
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