import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import { getAllRecipes, filterRecipes } from '../services/recipeService';
import { toggleFavorite } from '../services/favoriteService';
import useUserFavorites from '../services/useUserFavorites';
import RecipeSearchFilter from '../components/RecipeSearchFilter';
import RecipeCard from '../components/RecipeCard';
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
              <RecipeCard
                key={r._id}
                recipe={r}
                isAuth={isAuth}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;