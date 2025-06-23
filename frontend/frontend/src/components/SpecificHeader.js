import { logout, getCurrentUser } from '../services/authService';
import { ICONS } from '../config/config';
import '../styles/styles.css';

const SpecificHeader = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="specific-header">
      <div className="logo">
        <img
          src={ICONS.logo}
          alt="Logo"
          className="logo-img"
        />
        <span>Culinario</span>
        <span className="role-label">({user?.role})</span>
      </div>

      <button className="specific-header-button" onClick={handleLogout}>
        Вийти
      </button>
    </header>
  );
};

export default SpecificHeader;
