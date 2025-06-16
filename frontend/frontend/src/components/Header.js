import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/authService';
import '../styles/styles.css';

const Header = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={() => navigate('/home')}>
        <img
          src="https://i.postimg.cc/q7jMgfLd/logo.png"
          alt="Logo"
          className="logo-img"
        />
        <span>Culinary Guide</span>
      </div>

      <nav className="nav-links">
        <div className="nav-left">
            <Link to="/home" className="nav-link">Головна</Link>
            {isAuthenticated() && (
            <Link to="/profile" className="nav-link">Профіль</Link>,
            <Link to="/profile" className="nav-link">Збережене</Link>
            )}
        </div>

        <div className="nav-right">
            {isAuthenticated() ? (
            <button className="nav-button" onClick={handleLogout}>Вийти</button>
            ) : (
            <>
                <button className="nav-button" onClick={() => navigate('/login')}>Увійти</button>
                <button className="nav-button" onClick={() => navigate('/register')}>Реєстрація</button>
            </>
            )}
        </div>
    </nav>

    </header>
  );
};

export default Header;
