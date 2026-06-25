import React, { useState, useRef, useEffect, useCallback } from "react";
import "./TimerWidget.css";

const TimerWidget = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return clearTimer;
  }, []);

  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning]);

  const displayHours = Math.floor(remainingSeconds / 3600);
  const displayMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const displaySeconds = remainingSeconds % 60;

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleStart = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsFinished(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    clearTimer();
  };

  const handleResume = () => {
    if (remainingSeconds > 0) {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    setTotalSeconds(0);
    setRemainingSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const pad = (n) => String(n).padStart(2, "0");

  const hasStarted = totalSeconds > 0;

  return (
    <div className={`timer-widget ${isFinished ? "timer-widget--finished" : ""}`} id="timer-widget">
      <h3 className="timer-widget__title">⏱️ Countdown Timer</h3>

      {!hasStarted ? (
        <div className="timer-widget__setup">
          <div className="timer-widget__inputs">
            <div className="timer-widget__input-group">
              <label>HH</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                className="timer-widget__input"
                id="timer-hours"
              />
            </div>
            <span className="timer-widget__separator">:</span>
            <div className="timer-widget__input-group">
              <label>MM</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="timer-widget__input"
                id="timer-minutes"
              />
            </div>
            <span className="timer-widget__separator">:</span>
            <div className="timer-widget__input-group">
              <label>SS</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="timer-widget__input"
                id="timer-seconds"
              />
            </div>
          </div>
          <button onClick={handleStart} className="timer-widget__btn timer-widget__btn--start" id="timer-start-btn">
            Start Timer
          </button>
        </div>
      ) : (
        <div className="timer-widget__running">
          <div className="timer-widget__circle-wrap">
            <svg className="timer-widget__circle" viewBox="0 0 120 120">
              <circle className="timer-widget__circle-bg" cx="60" cy="60" r="54" />
              <circle
                className="timer-widget__circle-progress"
                cx="60"
                cy="60"
                r="54"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
            <div className="timer-widget__display">
              {pad(displayHours)}:{pad(displayMinutes)}:{pad(displaySeconds)}
            </div>
          </div>

          {isFinished && (
            <div className="timer-widget__alert">
              🔔 Time's up!
            </div>
          )}

          <div className="timer-widget__controls">
            {isRunning ? (
              <button onClick={handlePause} className="timer-widget__btn timer-widget__btn--pause" id="timer-pause-btn">
                ⏸ Pause
              </button>
            ) : !isFinished ? (
              <button onClick={handleResume} className="timer-widget__btn timer-widget__btn--start" id="timer-resume-btn">
                ▶ Resume
              </button>
            ) : null}
            <button onClick={handleReset} className="timer-widget__btn timer-widget__btn--reset" id="timer-reset-btn">
              ↻ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerWidget;
