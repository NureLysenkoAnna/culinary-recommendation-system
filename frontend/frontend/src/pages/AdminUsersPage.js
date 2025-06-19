import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService';
import SpecificHeader from '../components/SpecificHeader';
import '../styles/styles.css';

const roles = ['user', 'moderator', 'admin'];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'moderator'
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Помилка при завантаженні користувачів:', err);
    }
  };

  const handleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const filteredUsers = roleFilter
    ? users.filter((u) => u.role === roleFilter)
    : users;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateUser(editId, formData);
        setMessage('Користувача оновлено!');
      } else {
        await createUser(formData);
        setMessage('Користувача створено!');
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'moderator'
      });
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error('Помилка при збереженні:', error);
      setMessage('⚠ Помилка при збереженні користувача');
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setMessage('Користувача видалено.');
    fetchUsers();
  };

  return (
    <>
      <SpecificHeader />
      <div className="moderator-container">
        <h2>Керування користувачами</h2>

        <div className="role-filter">
            <label>Фільтр за роллю: </label>
            <select value={roleFilter} onChange={handleFilterChange}>
                <option value="">Усі</option>
                {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                ))}
            </select>
        </div>

        <div className="moderator-table-wrapper">
          <table className="moderator-table">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <img
                      src="https://i.postimg.cc/d1q4vKpP/edit.png"
                      alt="Редагувати"
                      title="Редагувати"
                      className="action-icon"
                      onClick={() => handleEdit(u)}
                    />
                    <img
                      src="https://i.postimg.cc/TwCQ34vy/delete.png"
                      alt="Видалити"
                      title="Видалити"
                      className="action-icon"
                      onClick={() => handleDelete(u._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit} className="moderator-form">
          <h2>{editId ? 'Редагувати користувача' : 'Додати адміністратора або модератора'}</h2>
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
            value={formData.password}
            onChange={handleChange}
            required={!editId}
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit">{editId ? 'Оновити' : 'Додати'}</button>
          {message && <p className="moderator-message">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default AdminUsersPage;
