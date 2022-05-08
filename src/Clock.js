import React, { useState, useEffect, useRef } from 'react';
import './Clock.css';

export default function Clock({ name, offsetMins, removeRequested }) {
  const componentRef = useRef(null);
  const intervalId = useRef(null);
  const [timeString, setTimeString] = useState("--:--:--");

  const initCssOffsets = () => {
    const timeSecsLocal = new Date().getTime() / 1000 + offsetMins * 60;
    // spin 0 is hand pointing upwards, 1 is full clockwise turn
    const secondHandInitialSpin = (timeSecsLocal % 60) / 60;
    const minuteHandInitialSpin = (timeSecsLocal % 3600) / 3600;
    const hourHandInitialSpin = (timeSecsLocal % 43200) / 43200; // 43.2k sec is 12 hr

    // convert to spin in degrees relative to the right (0=East, 90=South)
    const setSpin = (sel, spin) => componentRef.current.querySelector(sel).style
      .setProperty("--initial-spin", (spin * 360 - 90).toFixed(4) + "deg");

    setSpin(".hour-hand", hourHandInitialSpin);
    setSpin(".minute-hand", minuteHandInitialSpin);
    setSpin(".second-hand", secondHandInitialSpin);
    setSpin(".second-hand-tip", secondHandInitialSpin);
  };
  const initNumericClock = () => intervalId.current = window.setInterval(() => {
    // create localised HH:MM:SS string
    const unixLocalSec = Math.floor(new Date().getTime() / 1000 + 0.3) + offsetMins * 60;
    const sec = unixLocalSec % 60;
    const min = Math.floor(unixLocalSec / 60) % 60;
    const hr = Math.floor(unixLocalSec / 3600) % 24;
    const prependZero = num => (num < 10 ? "0" : "") + num;
    const newTimeString = [hr, min, sec].map(prependZero).join(":");
    setTimeString(newTimeString);
  }, 500); // delay is .5s for better display with laggy setInterval

  useEffect(() => {
    initCssOffsets();
    initNumericClock();
    return () => window.clearInterval(intervalId.current);
  }, []);

  const marker = forHour => <div className="marker"
    key={forHour} style={{ "--marker-hour": forHour }} />;
  const markersHours = [...Array(12).keys()];

  const createOffsetString = () => {
    const sign = offsetMins < 0 ? "-" : "+";
    let minSt = Math.abs(offsetMins) % 60;
    minSt = (minSt < 10 ? "0" : "") + minSt;
    let hrsSt = Math.floor(Math.abs(offsetMins) / 60);
    hrsSt = (hrsSt < 10 ? "0" : "") + hrsSt;
    return "UTC" + sign + hrsSt + ":" + minSt;
  };

  return (
    <div className="Clock" ref={componentRef}>
      <div className="numeric-time">{timeString}</div>
      <div className="offset-label">{createOffsetString()}</div>
      <div className="markers">
        {markersHours.map(hr => marker(hr))}
      </div>
      <div className="center-dot"></div>
      <div className="hand hour-hand"></div>
      <div className="hand minute-hand"></div>
      <div className="hand second-hand"></div>
      <div className="hand second-hand-tip"></div>
      <div className="center-dot center-dot-inner"></div>
      <div className="remove-button" onClick={e => removeRequested(name)}>Remove</div>
      <div className="clock-name">{name}</div>
    </div>
  );
};
