import React from 'react';
import { ICONS } from '../config/config';
import '../styles/styles.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  const handleDeleteConfirm = (id) => {
    if (window.confirm('Ви дійсно хочете видалити цього користувача?')) {
      onDelete(id);
    }
  };

  return (
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
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <img
                  src={ICONS.edit}
                  alt="Редагувати"
                  title="Редагувати"
                  className="action-icon"
                  onClick={() => onEdit(u)}
                />
                <img
                  src={ICONS.delete}
                  alt="Видалити"
                  title="Видалити"
                  className="action-icon"
                  onClick={() => handleDeleteConfirm(u._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;