import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { findRecipesByIngredients } from '../services/recipeService';
import MainHeader from '../components/MainHeader';
import '../styles/styles.css';

const IngredientSearchPage = () => {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromIngredientSearch) {
      setInput(location.state.input || '');
      setRecipes(location.state.recipes || []);
      setHasSearched(location.state.hasSearched || false);
    }else {
      const saved = sessionStorage.getItem('ingredientSearchState');
        if (saved) {
          const parsed = JSON.parse(saved);
          setInput(parsed.input || '');
          setRecipes(parsed.recipes || []);
          setHasSearched(parsed.hasSearched || false);
        }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredients = input.split(',').map(i => i.trim()).filter(Boolean);
    if (ingredients.length === 0) return;

    try {
      setLoading(true);
      const result = await findRecipesByIngredients(ingredients);
      setRecipes(result.slice(0, 10));
      setHasSearched(true);
    } catch (err) {
      console.error('Помилка при пошуку:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setRecipes([]);
    setHasSearched(false);
    sessionStorage.removeItem('ingredientSearchState');
  };

  const hasInputOrResults = input.trim() !== '' || recipes.length > 0;

  return (
    <>
      <MainHeader />
      <div className="container">
        <h2>Знайти рецепт за наявними інгредієнтами</h2>
        <form onSubmit={handleSubmit} className="ingredient-form">
            <input
                type="text"
                placeholder="Введіть інгредієнти через кому (наприклад: яйця, молоко, борошно)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="ingredient-input"
            />
            <div className="button-row">
                <button type="submit" className="search-button">Знайти</button>
                {hasInputOrResults && (
                <button type="button" className="reset-button" onClick={handleReset}>Скасувати</button>
                )}
            </div>
        </form>

        {loading && <p>Пошук...</p>}

        {hasSearched && recipes.length === 0 && !loading && (
          <p>Нічого не знайдено. Спробуйте інші інгредієнти.</p>
        )}

        <div className="recipe-grid">
          {recipes.map((r) => (
            <div key={r._id} className="recipe-card"
              onClick={() => {
                sessionStorage.setItem('ingredientSearchState', JSON.stringify({
                  input,
                  recipes,
                  hasSearched
                }));
                navigate(`/recipe/${r._id}`, {
                  state: {
                    fromIngredientSearch: true
                  }
                });
              }}
              >
              <img src={r.image} alt={r.title} className="recipe-img" />
              <h3>{r.title}</h3>
              <p>Кухня: {r.cuisine}</p>
              <p>Час приготування: {r.cookingTime} хв</p>
              <p>Складність: {r.complexity}</p>
              <p>
                Відповідні інгредієнти: {r.matchCount} / {r.ingredients.length}
              </p>
              {r.missingIngredients.length > 0 && (
                <p>
                  Відсутні інгредієнти: {r.missingIngredients.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IngredientSearchPage;
