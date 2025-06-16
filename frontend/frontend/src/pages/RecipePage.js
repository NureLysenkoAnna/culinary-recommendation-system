import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';
import Header from '../components/Header';
import '../styles/styles.css';

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error('Не вдалося завантажити рецепт:', err);
      }
    };
    fetch();
  }, [id]);

  if (!recipe) return <p>Завантаження...</p>;

  return (
    <>
      <Header />
      <div className="container">
        <h2>{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} className="recipe-img" />
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
