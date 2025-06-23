import React from 'react';
import '../styles/styles.css';

const UserForm = ({ formData, onChange, onSubmit, editId, message, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="moderator-form">
      <h2>{editId ? 'Редагувати користувача' : 'Додати адміністратора або модератора'}</h2>
      
      <input
        type="text"
        name="name"
        placeholder="Ім’я"
        value={formData.name}
        onChange={onChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={onChange}
        required={!editId}
      />
      <select name="role" value={formData.role} onChange={onChange}>
        {editId && <option value="user">user</option>}
        <option value="moderator">moderator</option>
        <option value="admin">admin</option>
      </select>

      <button type="submit">{editId ? 'Оновити' : 'Додати'}</button>
      {editId && (
          <button type="button" onClick={onCancel} style={{ marginTop: '20px' }}> 
            Скасувати
          </button>
        )}
      {message && <p className="moderator-message">{message}</p>}
    </form>
  );
};

export default UserForm;