import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Header from '../components/Header';
import '../styles/styles.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFadeOut(false);

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

  useEffect(() => {
    if (error) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
      const clearTimer = setTimeout(() => {
        setError('');
        setFadeOut(false);
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error]);

  return (
    <>
      <Header />
      <div className="login-page">
        <h2>Реєстрація</h2>
        <form onSubmit={handleSubmit} className="form-card">
          <input
            type="text"
            name="name"
            placeholder="Ім’я"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Повторіть пароль"
            minLength={6}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">Зареєструватися</button>

          {error && (
            <p className={`error ${fadeOut ? 'hidden' : ''}`}>{error}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
