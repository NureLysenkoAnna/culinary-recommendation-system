import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';
import { toggleFavorite, getUserFavorites } from '../services/favoriteService';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import Header from '../components/Header';
import '../styles/styles.css';

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate()

  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);

        if (isAuth && user?.id) {
          const favs = await getUserFavorites(user.id);
          const match = favs.find(f => f.recipe._id === id);
          if (match) setIsFavorite(true);
        }
      } catch (err) {
        console.error('Не вдалося завантажити рецепт або улюблені:', err);
      }
    };
    fetch();
  }, [id, isAuth, user?.id]);

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorite(id);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error('Помилка при зміні статусу улюбленого:', err);
    }
  };

  if (!recipe) return <p>Завантаження...</p>;

  return (
    <>
      <Header />

      <div className="container">
        <span className="back-inside" onClick={() => navigate(-1)}>
          ← Назад
        </span>
        <h2>{recipe.title}</h2>

        <div className="recipe-image-wrapper">
          <img src={recipe.image} alt={recipe.title} className="recipe-img" />
          {isAuth && (
            <span
              className={`favorite-toggle ${isFavorite ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Видалити з улюбленого' : 'Додати до улюбленого'}
            >
              ♥
            </span>
          )}
        </div>

        <p><strong>Кухня:</strong> {recipe.cuisine}</p>
        <p><strong>Час приготування:</strong> {recipe.cookingTime} хв</p>
        <p><strong>Складність:</strong> {recipe.complexity}</p>

        <h4>Інгредієнти:</h4>
        <ul>
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>

        <h4>Інструкція:</h4>
        <p>{recipe.instructions}</p>
      </div>
    </>
  );
};

export default RecipePage;
