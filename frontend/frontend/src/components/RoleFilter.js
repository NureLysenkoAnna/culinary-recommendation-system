import React from 'react';
import '../styles/styles.css';

const RoleFilter = ({ roles, selected, onChange }) => {
  return (
    <div className="role-filter">
      <label>Фільтр за роллю: </label>
      <select value={selected} onChange={onChange}>
        <option value="">Усі</option>
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleFilter;