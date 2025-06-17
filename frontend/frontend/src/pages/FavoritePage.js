import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFavorites, deleteFavorite } from '../services/favoriteService';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import { filterRecipes } from '../services/recipeService';
import Header from '../components/Header';
import RecipeSearchFilter from '../components/RecipeSearchFilter';
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
      <Header />
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
          <p>😕 Рецепт серед улюблених не знайдено, спробуйте інший запит.</p>
        ) : (
          <div className="recipe-grid">
            {sortedRecipes.map((f) => {
              const recipe = f.recipe || f;
              return (
                <div
                  className="recipe-card"
                  key={f._id}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                >
                  <img src={recipe.image} alt={recipe.title} className="recipe-img" />

                  <span
                    className="remove-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(f._id);
                    }}
                    title="Видалити з улюблених"
                  >
                    ✖
                  </span>

                  <h3>{recipe.title}</h3>
                  <p>Кухня: {recipe.cuisine}</p>
                  <p>Час: {recipe.cookingTime} хв</p>
                  <p>Складність: {recipe.complexity}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritePage;
