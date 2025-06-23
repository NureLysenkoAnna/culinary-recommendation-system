import React, { useEffect, useState } from 'react';
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  filterRecipes,
} from '../services/recipeService';
import RecipeSearchFilter from '../components/RecipeSearchFilter';
import SpecificHeader from '../components/SpecificHeader';
import '../styles/styles.css';

const cuisines = ['українська', 'італійська', 'французька', 'індійська', 'китайська', 'японська', 'американська', 'інше'];
const complexities = ['easy', 'medium', 'hard'];

const ModeratorRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    cuisine: cuisines[0],
    cookingTime: '',
    complexity: complexities[0],
    ingredients: '',
    instructions: '',
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchRecipes = async () => {
    const data = await getAllRecipes();
    setRecipes(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      ingredients: formData.ingredients
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0)
    };

    try {
      if (editId) {
        await updateRecipe(editId, formattedData);
        setMessage('Рецепт оновлено успішно!');
      } else {
        await createRecipe(formattedData);
        setMessage('Рецепт створено успішно!');
      }

      setFormData({
        title: '',
        image: '',
        cuisine: cuisines[0],
        cookingTime: '',
        complexity: complexities[0],
        ingredients: '',
        instructions: '',
      });
      setEditId(null);
      fetchRecipes();
    } catch (error) {
      console.error('Помилка при збереженні рецепта:', error);
      setMessage('⚠ Сталася помилка під час збереження рецепта');
    }
  };

  const handleEdit = (recipe) => {
    setEditId(recipe._id);
    setFormData({
      title: recipe.title,
      image: recipe.image,
      cuisine: recipe.cuisine,
      cookingTime: recipe.cookingTime,
      complexity: recipe.complexity,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients,
      instructions: recipe.instructions,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    setMessage('Рецепт видалено.');
    fetchRecipes();
  };

  const handleSearch = async (filters) => {
    try {
      const filtered = await filterRecipes(filters);
      setRecipes(filtered);
    } catch (err) {
      console.error('Помилка при фільтрації:', err);
    }
  };

  const handleReset = async () => {
    try {
      const all = await getAllRecipes();
      setRecipes(all);
    } catch (err) {
      console.error('Не вдалося отримати всі рецепти:', err);
    }
  };

  return (
    <>
        <SpecificHeader />
        <div className="moderator-container">
            <h2>Управління рецептами:</h2>

            <RecipeSearchFilter onSearch={handleSearch} onReset={handleReset} />

            <div className="moderator-table-wrapper">
                <table className="moderator-table">
                    <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Кухня</th>
                        <th>Час</th>
                        <th>Складність</th>
                        <th>Інструкції</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recipes.map((r) => (
                        <tr key={r._id}>
                        <td>{r.title}</td>
                        <td>{r.cuisine}</td>
                        <td>{r.cookingTime} хв</td>
                        <td>{r.complexity}</td>
                        <td className="instructions-cell">{r.instructions}</td>
                        <td>
                            <img
                                src="https://i.postimg.cc/d1q4vKpP/edit.png"
                                alt="Редагувати"
                                title="Редагувати"
                                className="action-icon"
                                onClick={() => handleEdit(r)}
                            />
                            <img
                                src="https://i.postimg.cc/TwCQ34vy/delete.png"
                                alt="Видалити"
                                title="Видалити"
                                className="action-icon"
                                onClick={() => {
                                  if (window.confirm('Ви дійсно хочете видалити цей рецепт?')) {
                                    handleDelete(r._id);
                                  }
                                }}
                            />
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <form onSubmit={handleSubmit} className="moderator-form">
                <h2>Взаємодія з конкретним рецептом:</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Назва рецепта"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Посилання на зображення"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />
                <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
                {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
                </select>
                <input
                    type="number"
                    name="cookingTime"
                    placeholder="Час приготування (хв)"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    required
                />
                <select name="complexity" value={formData.complexity} onChange={handleChange}>
                {complexities.map((level) => (
                    <option key={level} value={level}>{level}</option>
                ))}
                </select>
                <textarea
                    name="ingredients"
                    placeholder="Інгрідієнти (через кому)"
                    value={formData.ingredients}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="instructions"
                    placeholder="Інструкції приготування"
                    value={formData.instructions}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{editId ? 'Оновити рецепт' : 'Створити рецепт'}</button>
                {message && <p className="moderator-message">{message}</p>}
            </form>
        </div>
    </>
  );
};

export default ModeratorRecipesPage;
