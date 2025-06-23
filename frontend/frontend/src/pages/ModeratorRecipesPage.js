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
import RecipeTable from '../components/RecipeTable';
import RecipeForm from '../components/RecipeForm';
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
      setMessage('Сталася помилка під час збереження рецепта');
    }
  };

  const resetForm = () => {
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
    setMessage('');
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

  const handleCancelEdit = () => {
    resetForm();
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

            <RecipeTable
              recipes={recipes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <RecipeForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              editId={editId}
              message={message}
              cuisines={cuisines}
              complexities={complexities}
            />
        </div>
    </>
  );
};

export default ModeratorRecipesPage;
