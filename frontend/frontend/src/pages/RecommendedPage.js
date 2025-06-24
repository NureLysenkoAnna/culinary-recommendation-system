import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import RecipeCard from '../components/RecipeCard';
import { getUserPreference } from '../services/preferenceService';
import { getRecommendedRecipes } from '../services/recommendationService';
import useUserFavorites from '../services/useUserFavorites';
import { toggleFavorite } from '../services/favoriteService';
import '../styles/styles.css';

const RecommendedPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [hasPreferences, setHasPreferences] = useState(true);
  const navigate = useNavigate();

  const { isAuth, user, favorites, setFavorites } = useUserFavorites();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) return;

      try {
        const pref = await getUserPreference(user.id);
        if (!pref) {
          setHasPreferences(false);
          return;
        }
        setHasPreferences(true);

        const res = await getRecommendedRecipes();
        setRecipes(res);
      } catch (err) {
        console.error('Помилка при завантаженні рекомендацій або вподобань:', err);
        setHasPreferences(false);
      }
    };

    fetchData();
  }, [user]);

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
    } catch (err) {
      console.error('Помилка при зміні обраного:', err);
    }
  };

  return (
    <>
      <MainHeader />
      <div className="container">
        <h2>Рекомендовано для вас</h2>

        {!hasPreferences ? (
          <div className="no-preferences">
            <p>Щоб отримати персональні рекомендації або випадковий рецепт, спочатку заповніть свої вподобання.</p>
            <button className="go-profile-button" onClick={() => navigate('/profile')}>
              Перейти до профілю →
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <p>На жаль, наразі немає рецептів, які відповідали б вашим вподобанням.</p>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
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

export default RecommendedPage;
