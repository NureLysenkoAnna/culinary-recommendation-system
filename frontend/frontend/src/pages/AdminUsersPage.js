import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService';
import SpecificHeader from '../components/SpecificHeader';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import RoleFilter from '../components/RoleFilter';
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
      setMessage('Помилка при збереженні користувача');
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
  
  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'moderator'
    });
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

        <RoleFilter
          roles={roles}
          selected={roleFilter}
          onChange={handleFilterChange}
        />

        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editId={editId}
          message={message}
          onCancel={handleCancelEdit}
        />
      </div>
    </>
  );
};

export default AdminUsersPage;