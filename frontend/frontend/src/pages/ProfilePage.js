import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import { getUserPreference } from '../services/preferenceService';
import Header from '../components/Header';
import PreferenceForm from '../components/PreferenceForm';

import '../styles/styles.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showForm, setShowForm] = useState(false);
  const [preference, setPreference] = useState(null);

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const pref = await getUserPreference(user.id);
        setPreference(pref);
      } catch {
        setPreference(null);
      }
    };
    fetchPreference();
  }, [user.id]);

  const handleSaved = async () => {
    setShowForm(false);
    const updated = await getUserPreference(user.id);
    setPreference(updated);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Профіль користувача</h2>
        {user ? (
          <div className="profile-info">
            <p><strong>Ім’я:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div style={{ marginTop: '30px' }}>
              {!preference && !showForm && (
                <>
                  <p>Для поліпшення рекомендацій введіть свої уподобання:</p>
                  <button onClick={() => setShowForm(true)}>Додати уподобання</button>
                </>
              )}

              {preference && !showForm && (
                <>
                  <h3>Ваші уподобання:</h3>
                  <p><strong>Дієта:</strong> {preference.diet}</p>
                  <p><strong>Алергії:</strong> {preference.allergies?.join(', ') || 'немає'}</p>
                  <p><strong>Нелюбі інгредієнти:</strong> {preference.dislikedIngredients?.join(', ') || 'немає'}</p>
                  <button onClick={() => setShowForm(true)}>Оновити уподобання</button>
                </>
              )}

              {showForm && (
                <PreferenceForm onSaved={handleSaved} existing={preference} />
              )}
            </div>
          </div>
        ) : (
          <p className="error">Немає даних про користувача.</p>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
