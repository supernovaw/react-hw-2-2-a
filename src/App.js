import React, { useState } from 'react';
import './App.css';
import CityAddForm from "./CityAddForm";
import Clock from "./Clock";
import parseUtcOffset from "./parseUtcOffset";

export default function App() {
  const [addedCities, setAddedCities] = useState({ "Los Angeles": -420, "Kathmandu": 345, "Tokyo": 540 });
  const onAdd = ([city, utcOffset]) => {
    if (addedCities[city]) {
      alert("City of " + city + " was already added");
      return false;
    }
    if (city === '') {
      alert("Please enter the name of the city");
      return false;
    }
    const offsetMins = parseUtcOffset(utcOffset);
    if (offsetMins === null) {
      alert("Please enter a valid UTC offset (e.g. -08:00 or 2)")
      return false;
    }
    setAddedCities(prev => ({ ...prev, [city]: offsetMins }));
    return true;
  };
  const onRemove = city => setAddedCities(prev => {
    const newList = { ...prev };
    delete newList[city];
    return newList;
  });

  const cityNamesSorted = Object.keys(addedCities)
    .sort((city1, city2) => addedCities[city1] - addedCities[city2]);

  return (
    <div className="App">
      <CityAddForm onAdd={onAdd} />
      <div className="clocks">
        {cityNamesSorted.map(city =>
          <Clock name={city} offsetMins={addedCities[city]}
            key={city} removeRequested={onRemove} />
        )}
      </div>
    </div>
  );
};
