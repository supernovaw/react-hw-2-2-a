import React from 'react';
import './CityAddForm.css';

export default ({ onAdd }) => (
  <form className="CityAddForm" onSubmit={e => {
    e.preventDefault();
    if (!onAdd([0, 1].map(i => e.target[i].value.trim()))) return;
    // clear fields
    [0, 1].forEach(i => e.target[i].value = "");
  }}>
    <div>
      <label htmlFor="city-input">City</label>
      <input id="city-input" />
    </div>
    <div>
      <label htmlFor="utc-offset-input">UTC offset</label>
      <input id="utc-offset-input" />
    </div>
    <button>Add</button>
  </form>
);
