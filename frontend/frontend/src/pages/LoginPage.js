import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../styles/styles.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка входу');
    }
  };

  return (
    <div className="container">
      <h2>Вхід</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <button type="submit">Увійти</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;
