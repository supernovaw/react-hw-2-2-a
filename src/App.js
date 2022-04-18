import React, { useState } from 'react';
import './App.css';
import CityAddForm from "./CityAddForm";
import Clock from "./Clock";

// return number of minutes (e.g. +540 for Tokyo) or null
// allow: +09, -08, 3, +0545, -08:00, +2:00
const parseUtcOffset = str => {
  let sign = 0;
  if (str[0] === '+') sign = 1;
  else if (str[0] === '-') sign = -1;

  if (sign !== 0) str = str.substring(1); // remove leading + or -
  if (sign === 0) sign = 1; // assume we're ahead of Greenwich when no + or -

  let hours, minutes = "00";
  if (/^\d\d?$/.test(str)) { // H or HH
    hours = str;
  } else if (/^\d\d?:\d\d$/.test(str)) { // HH:MM or H:MM
    hours = str.substring(0, str.length - 3);
    minutes = str.substring(str.length - 2);
  } else if (/^\d{4}$/.test(str)) { // HHMM
    hours = str.substring(0, 2);
    minutes = str.substring(2);
  } else { // invalid
    return null;
  }
  minutes = parseInt(minutes, 10);
  if (minutes >= 60) return null;
  hours = parseInt(hours, 10);

  const utcOffsetMinutes = sign * (hours * 60 + minutes);
  if (utcOffsetMinutes < -12 * 60) return null; // cannot be West of -12:00
  if (utcOffsetMinutes > 14 * 60) return null; // cannot be East of +14:00
  return utcOffsetMinutes;
};

export default function App() {
  const [addedCities, setAddedCities] = useState({ "Los Angeles": -420, "Kathmandu": 345, "Tokyo": 540 });
  const onAdd = ([city, utcOffset]) => {
    if (addedCities[city]) {
      alert("City of " + city + " was already added");
      return;
    }
    if (city === '') {
      alert("Please enter the name of the city");
      return;
    }
    const offsetMins = parseUtcOffset(utcOffset);
    if (offsetMins === null) {
      alert("Please enter a valid UTC offset (e.g. -08:00 or 2)")
      return;
    }
    setAddedCities(prev => ({ ...prev, [city]: offsetMins }));
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
