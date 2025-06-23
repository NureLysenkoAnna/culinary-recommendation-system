import React from 'react';
import { ICONS } from '../config/config';

const RecipeTable = ({ recipes, onEdit, onDelete }) => {
  return (
    <div className="moderator-table-wrapper">
      <table className="moderator-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Кухня</th>
            <th>Час</th>
            <th>Складність</th>
            <th>Інструкції</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r._id}>
              <td>{r.title}</td>
              <td>{r.cuisine}</td>
              <td>{r.cookingTime} хв</td>
              <td>{r.complexity}</td>
              <td className="instructions-cell">{r.instructions}</td>
              <td>
                <img
                  src={ICONS.edit}
                  alt="Редагувати"
                  title="Редагувати"
                  className="action-icon"
                  onClick={() => onEdit(r)}
                />
                <img
                  src={ICONS.delete}
                  alt="Видалити"
                  title="Видалити"
                  className="action-icon"
                  onClick={() => {
                    if (window.confirm('Ви дійсно хочете видалити цей рецепт?')) {
                      onDelete(r._id);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeTable;