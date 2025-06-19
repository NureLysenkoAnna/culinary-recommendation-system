import React, { useState } from 'react';
import '../styles/styles.css';

const RecipeSearchFilter = ({ onSearch, onReset }) => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [complexity, setComplexity] = useState('');
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [ingredient, setIngredient] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query,
      cuisine,
      complexity,
      minTime,
      maxTime,
      ingredient
    });
  };

  const handleReset = () => {
    setQuery('');
    setCuisine('');
    setComplexity('');
    setMinTime('');
    setMaxTime('');
    setIngredient('');
    onSearch({ query: '', cuisine: '', complexity: '', minTime: '', maxTime: '', ingredient: '' });
    if (onReset) onReset();
  };

  const hasFilters = query || cuisine || complexity || minTime || maxTime || ingredient;

  return (
    <div className="search-filter-box">
      <form onSubmit={handleSubmit}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Знайти</button>
          {hasFilters && (
            <button type="button" className="reset-button" onClick={handleReset}>Скасувати</button>
          )}
        </div>

        <div className="search-filter-grid">
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">Кухня (усі)</option>
            <option value="українська">Українська</option>
            <option value="італійська">Італійська</option>
            <option value="японська">Японська</option>
            <option value="французька">Французька</option>
            <option value="індійська">Індійська</option>
            <option value="китайська">Китайська</option>
            <option value="американська">Американська</option>
            <option value="інше">Інше</option>
          </select>

          <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="">Складність (усі)</option>
            <option value="easy">Легка</option>
            <option value="medium">Середня</option>
            <option value="hard">Висока</option>
          </select>

          <input
            type="number"
            placeholder="Час від (хв)"
            value={minTime}
            onChange={(e) => setMinTime(e.target.value)}
          />
          <input
            type="number"
            placeholder="Час до (хв)"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
          />
          <input
            type="text-ingredient"
            placeholder="Інгредієнт:"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default RecipeSearchFilter;
