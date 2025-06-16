import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import '../styles/styles.css';
import Header from '../components/Header';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <>
    <Header/>
    <div className="container">
      <h2>Профіль користувача</h2>
      {user ? (
        <div className="profile-info">
          <p><strong>Ім’я:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout}>Вийти</button>
        </div>
      ) : (
        <p className="error">Немає даних про користувача.</p>
      )}
    </div>
    </>
  );
};

export default ProfilePage;
