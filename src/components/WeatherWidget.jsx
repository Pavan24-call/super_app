import React, { useEffect, useState, useRef } from "react";
import { fetchCurrentWeather, searchCities } from "../services/api";
import "./WeatherWidget.css";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // City search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadWeather = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError("City not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather("Mumbai");
  }, []);

  // Debounced city search
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      const results = await searchCities(value);
      setSuggestions(results);
      setSearching(false);
    }, 350);
  };

  const handleCitySelect = (city) => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSearch(false);
    loadWeather(city.name);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setSuggestions([]);
      setShowSearch(false);
      loadWeather(searchQuery.trim());
      setSearchQuery("");
    }
  };

  if (loading) {
    return (
      <div className="weather-widget weather-widget--loading" id="weather-widget">
        <div className="weather-widget__skeleton">
          <div className="skeleton-pulse skeleton-circle"></div>
          <div className="skeleton-pulse skeleton-line"></div>
          <div className="skeleton-pulse skeleton-line skeleton-line--short"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget" id="weather-widget">
      <div className="weather-widget__header">
        <div className="weather-widget__location" onClick={() => setShowSearch((v) => !v)} title="Click to change city">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{weather?.name || "Select city"}</span>
          <svg className="weather-widget__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* City Search */}
      {showSearch && (
        <div className="weather-widget__search" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="weather-widget__search-input"
              placeholder="Search any city..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              autoFocus
              id="weather-city-search"
            />
          </form>
          {suggestions.length > 0 && (
            <ul className="weather-widget__suggestions">
              {suggestions.map((city, i) => (
                <li
                  key={i}
                  className="weather-widget__suggestion"
                  onClick={() => handleCitySelect(city)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {city.display}
                </li>
              ))}
            </ul>
          )}
          {searching && <div className="weather-widget__searching">Searching...</div>}
        </div>
      )}

      {error ? (
        <div className="weather-widget__error-inline">
          <span>⚠️</span> {error}
        </div>
      ) : weather ? (
        <>
          <div className="weather-widget__main">
            <span className="weather-widget__icon">{weather.icon}</span>
            <div className="weather-widget__temp">
              <span className="weather-widget__temp-value">{weather.temp}</span>
              <span className="weather-widget__temp-unit">°C</span>
            </div>
          </div>

          <p className="weather-widget__desc">{weather.description}</p>

          <div className="weather-widget__details">
            <div className="weather-widget__detail">
              <span className="weather-widget__detail-icon">💧</span>
              <div>
                <span className="weather-widget__detail-value">{weather.humidity}%</span>
                <span className="weather-widget__detail-label">Humidity</span>
              </div>
            </div>
            <div className="weather-widget__detail">
              <span className="weather-widget__detail-icon">💨</span>
              <div>
                <span className="weather-widget__detail-value">{weather.wind_speed} km/h</span>
                <span className="weather-widget__detail-label">Wind</span>
              </div>
            </div>
            <div className="weather-widget__detail">
              <span className="weather-widget__detail-icon">🌡️</span>
              <div>
                <span className="weather-widget__detail-value">{weather.pressure} hPa</span>
                <span className="weather-widget__detail-label">Pressure</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
