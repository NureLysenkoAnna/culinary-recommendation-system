import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../services/authService';
import MainHeader from '../components/MainHeader';
import '../styles/styles.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    try {
      await login(formData);
      if (isAuthenticated()) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'moderator') {
          navigate('/moderator');
        } else if (user.role === 'admin'){
          navigate('/admin');
        } else {
        navigate('/profile');
        } 
      }
    } catch (err) {
      setServerError( 'Невірний пароль або пошта!');
    }
  };

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError('');
      }, 2600);

      return () => clearTimeout(timer);
    }
  }, [serverError]);

  return (
    <>
      <MainHeader />
      <div className="login-page">
        <h2>Вхід до системи</h2>
        <form onSubmit={handleSubmit} className="form-card">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="login-button">Увійти</button>
          {serverError && (
            <p className="error" style={{ marginTop: '10px' }}>{serverError}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default LoginPage;