import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFavorites, deleteFavorite } from '../services/favoriteService';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import { filterRecipes } from '../services/recipeService';
import MainHeader from '../components/MainHeader';
import RecipeSearchFilter from '../components/RecipeSearchFilter';
import RecipeCard from '../components/RecipeCard';
import '../styles/styles.css';

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [isSearching, setIsSearching] = useState(false);
  const isAuth = isAuthenticated();
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuth || !user?.id) return;
      try {
        const favs = await getUserFavorites(user.id);
        setFavorites(favs);
        setFilteredFavorites([]); // Скидаємо фільтрований список при завантаженні
      } catch (err) {
        console.error('Не вдалося завантажити улюблені:', err);
      }
    };

    fetchFavorites();
  }, [isAuth, user?.id]);

  const handleRemove = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites(prev => prev.filter(f => f._id !== favoriteId));
      setFilteredFavorites(prev => prev.filter(f => f._id !== favoriteId));
    } catch (err) {
      console.error('Не вдалося видалити улюблене:', err);
    }
  };

  const handleSearch = async (filters) => {
    setIsSearching(true);
    try {
      const results = await filterRecipes(filters);
      const favRecipeIds = favorites.map(f => f.recipe._id);
      const filtered = results.filter(r => favRecipeIds.includes(r._id));
      setFilteredFavorites(filtered);
    } catch (err) {
      console.error('Помилка при пошуку та фільтрації:', err);
    }
  };

  const handleReset = () => {
    setFilteredFavorites([]);
    setIsSearching(false);
  };

  const displayedRecipes = filteredFavorites.length > 0 ? filteredFavorites : isSearching ? [] : favorites;

  const sortedRecipes = [...displayedRecipes].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.recipe?.createdAt);
    const dateB = new Date(b.createdAt || b.recipe?.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <>
      <MainHeader />
      <div className="container">
        <h2>Збережені рецепти</h2>
        <RecipeSearchFilter onSearch={handleSearch} onReset={handleReset} />

        <div className="sort-box">
          <label htmlFor="sort">Сортувати за датою:</label>
          <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Спочатку нові</option>
            <option value="oldest">Спочатку старі</option>
          </select>
        </div>

        {displayedRecipes.length === 0 ? (
          isSearching ? (
            <p className="no-favorites-message">😕 Рецепт серед улюблених не знайдено, спробуйте інший запит.</p>
          ) : (
            <p className="no-favorites-message">У вас ще немає збережених рецептів! Перегляньте
             <span className="link" onClick={() => navigate('/home')}>усі рецепти</span> і додайте до улюблених.</p>
          )
        ) : (
          <div className="recipe-grid">
            {sortedRecipes.map((f) => {
              const recipe = f.recipe || f;
              return (
                <RecipeCard
                  key={f._id}
                  recipe={recipe}
                  isAuth={true}
                  iconType="remove"
                  onIconClick={() => handleRemove(f._id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritePage;
