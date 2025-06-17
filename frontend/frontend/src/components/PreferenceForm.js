import React, { useState, useEffect } from 'react';
import { createPreference, updatePreference, getUserPreference } from '../services/preferenceService';
import { getCurrentUser } from '../services/authService';

const diets = [
  'none', 'vegetarian', 'vegan', 'gluten-free', 'dairy-free',
  'paleo', 'keto', 'low-carb', 'low-fat', 'halal', 'kosher'
];

const PreferenceForm = ({ onSaved, existing }) => {
  const user = getCurrentUser();
  const [preference, setPreference] = useState(null);
  const [form, setForm] = useState({
    diet: 'none',
    allergies: '',
    dislikedIngredients: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const pref = await getUserPreference(user.id);
        setPreference(pref);
        setForm({
          diet: pref.diet || 'none',
          allergies: pref.allergies?.join(', ') || '',
          dislikedIngredients: pref.dislikedIngredients?.join(', ') || ''
        });
      } catch {
        // Вподобання ще не задано — лишити дефолт
      }
    };
    fetchPreference();
  }, [user.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      diet: form.diet,
      allergies: form.allergies.split(',').map(a => a.trim()).filter(Boolean),
      dislikedIngredients: form.dislikedIngredients.split(',').map(i => i.trim()).filter(Boolean)
    };
    try {
      if (preference) {
        await updatePreference(preference._id, data);
        onSaved();
        setStatus('Уподобання оновлено');
      } else {
        await createPreference(data);
        onSaved();
        setStatus('Уподобання збережено');
      }
    } catch (err) {
      console.error('Помилка:', err);
      setStatus('Сталася помилка при збереженні');
    }
  };

  return (
    <form className="preference-form" onSubmit={handleSubmit}>
      <h3>Ваші вподобання</h3>

      <label htmlFor="diet">Дієта:</label>
      <select id="diet" name="diet" value={form.diet} onChange={handleChange}>
        {diets.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <label htmlFor="allergies">Алергії (запис через кому):</label>
      <input
        id="allergies"
        name="allergies"
        type="text"
        value={form.allergies}
        onChange={handleChange}
        placeholder="наприклад: горіхи, глютен"
      />

      <label htmlFor="dislikedIngredients">Небажані інгредієнти (запис через кому):</label>
      <input
        id="dislikedIngredients"
        name="dislikedIngredients"
        type="text"
        value={form.dislikedIngredients}
        onChange={handleChange}
        placeholder="наприклад: броколі, цибуля"
      />

      <button type="submit">
        {preference ? 'Оновити вподобання' : 'Зберегти вподобання'}
      </button>

      {status && <p style={{ marginTop: '10px', color: '#28a745' }}>{status}</p>}
    </form>
  );
};

export default PreferenceForm;
