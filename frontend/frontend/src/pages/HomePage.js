import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import { getAllRecipes, filterRecipes } from '../services/recipeService';
import { toggleFavorite } from '../services/favoriteService';
import useUserFavorites from '../services/useUserFavorites';
import RecipeSearchFilter from '../components/RecipeSearchFilter';
import '../styles/styles.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const { isAuth, user, favorites, setFavorites } = useUserFavorites();
  const navigate = useNavigate();

  const handleSearch = async (filters) => {
    try {
      const results = await filterRecipes(filters);
      setRecipes(results);
    } catch (err) {
      console.error('Помилка при пошуку та фільтрації:', err);
    }
  };

  // Завантажити рецепти
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipeList = await getAllRecipes();
        setRecipes(recipeList);
      } catch (error) {
        console.error('Помилка при завантаженні рецептів:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Обробка натискання
  const handleToggleFavorite = async (recipeId) => {
    if (!isAuth) return;

    try {
      const recipeIdStr = recipeId.toString();
      await toggleFavorite(recipeIdStr);

      setFavorites((prev) =>
        prev.includes(recipeIdStr)
          ? prev.filter((id) => id !== recipeIdStr)
          : [...prev, recipeIdStr]
      );
    } catch (error) {
      console.error('Помилка при зміні обраного:', error);
    }
  };

  //Очікуємо завантаження favorites
  if (isAuth && favorites === null) {
    return (
      <>
        <MainHeader />
        <div className="container">
          <p>Завантаження улюблених рецептів...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <RecipeSearchFilter onSearch={handleSearch} />
      <div className="container">
        {!isAuth ? (
          <p>Доступні рецепти без реєстрації:</p>
        ) : (
          <p>Ласкаво просимо, {user?.name}! Ось доступні рецепти для ознайомлення:</p>
        )}
        {recipes.length === 0 ? (
          <p className="empty-message">😕 Рецепт не знайдено, спробуйте інший запит.</p>
        ) : (
          <div className="recipe-grid">
            {recipes.map((r) => (
              <div className="recipe-card" key={r._id} onClick={() => navigate(`/recipe/${r._id}`)}>
                <img src={r.image} alt={r.title} className="recipe-img" />
                {isAuth && (
                  <span
                    className={`heart-icon ${favorites.includes(r._id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(r._id);
                    }}
                  >
                    ♥
                  </span>
                )}
                <h3>{r.title}</h3>
                <p>Кухня: {r.cuisine}</p>
                <p>Час: {r.cookingTime} хв</p>
                <p>Складність: {r.complexity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;