import React from 'react';
import './CityAddForm.css';

export default ({ onAdd }) => (
  <form className="CityAddForm" onSubmit={e => {
    e.preventDefault();
    onAdd([0, 1].map(i => e.target[i].value.trim()));
  }}>
    <div>
      <label htmlFor="city-input">City</label>
      <input id="city-input"></input>
    </div>
    <div>
      <label htmlFor="utc-offset-input">UTC offset</label>
      <input id="utc-offset-input"></input>
    </div>
    <button>Add</button>
  </form>
);
