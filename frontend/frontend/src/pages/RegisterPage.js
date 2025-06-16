import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../styles/styles.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    try {
      await register(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка реєстрації');
    }
  };

  return (
    <div className="container">
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Ім’я" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Повторіть пароль" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Зареєструватися</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterPage;
