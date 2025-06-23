import React from 'react';

const cuisines = ['українська', 'італійська', 'французька', 'індійська', 'китайська', 'японська', 'американська', 'інше'];
const complexities = ['easy', 'medium', 'hard'];

const RecipeForm = ({ formData, onChange, onSubmit, editId, message, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="moderator-form">
      <h2>Взаємодія з конкретним рецептом:</h2>
      <input
        type="text"
        name="title"
        placeholder="Назва рецепта"
        value={formData.title}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="image"
        placeholder="Посилання на зображення"
        value={formData.image}
        onChange={onChange}
        required
      />
      <select name="cuisine" value={formData.cuisine} onChange={onChange}>
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine}>{cuisine}</option>
        ))}
      </select>
      <input
        type="number"
        name="cookingTime"
        placeholder="Час приготування (хв)"
        value={formData.cookingTime}
        onChange={onChange}
        required
      />
      <select name="complexity" value={formData.complexity} onChange={onChange}>
        {complexities.map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
      <textarea
        name="ingredients"
        placeholder="Інгрідієнти (через кому)"
        value={formData.ingredients}
        onChange={onChange}
        required
      />
      <textarea
        name="instructions"
        placeholder="Інструкції приготування"
        value={formData.instructions}
        onChange={onChange}
        required
      />
      <button type="submit">{editId ? 'Оновити рецепт' : 'Створити рецепт'}</button>
      {editId && (
        <button type="button" onClick={onCancel} style={{ marginTop: '20px' }} 
        > Скасувати </button>
      )}
      {message && <p className="moderator-message">{message}</p>}
    </form>
  );
};

export default RecipeForm;
