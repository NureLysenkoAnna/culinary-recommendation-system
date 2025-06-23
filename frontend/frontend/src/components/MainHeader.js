import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/authService';
import { getRandomRecipe } from '../services/recommendationService';
import { ICONS } from '../config/config';
import '../styles/styles.css';

const MainHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/home';
  };

  const handleRandomClick = async () => {
    try {
      const recipe = await getRandomRecipe();
      navigate(`/recipe/${recipe._id}`);
    } catch (error) {
      if (error.response?.status === 404) {
      navigate('/recommended');
      } else {
        alert(error.response?.data?.message || 'Не вдалося отримати випадковий рецепт');
      }
    }
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={() => navigate('/home')}>
        <img
          src={ICONS.logo}
          alt="Logo"
          className="logo-img"
        />
        <span>Culinario</span>
      </div>

      <nav className="nav-links">
        <div className="nav-left">
            <NavLink to="/home" className="nav-link">Головна</NavLink>
            {isAuthenticated() && (
              <>
                <NavLink to="/favorites" className="nav-link">Улюблене</NavLink>
                <NavLink to="/recommended" className="nav-link">Рекомендовані</NavLink>
                <NavLink to="/by-ingredients" className="nav-link">З того, що є</NavLink>
                <NavLink to="/profile" className="nav-link">Профіль</NavLink>
                <img
                  src={ICONS.random}
                  alt="Випадковий рецепт"
                  className="dice-image"
                  onClick={handleRandomClick}
                  title="Спробувати випадковий рецепт"
                />
              </>
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

export default MainHeader;
