import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { discoverMoviesByGenre, MOVIE_LANGUAGES } from "../services/api";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import "./Movies.css";

const Movies = () => {
  const categories = useStore((state) => state.categories);
  const navigate = useNavigate();
  const [moviesByCategory, setMoviesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const fetchMovies = useCallback(async (lang) => {
    setLoading(true);
    const results = {};

    for (const cat of categories) {
      try {
        const movies = await discoverMoviesByGenre(cat, lang);
        if (movies && movies.length > 0) {
          results[cat] = movies;
        }
      } catch (err) {
        console.error(`Failed to fetch movies for ${cat}:`, err);
      }
    }

    setMoviesByCategory(results);
    setLoading(false);
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchMovies(selectedLang);
    }
  }, [categories, selectedLang, fetchMovies]);

  const handleLangChange = (langCode) => {
    setSelectedLang(langCode);
    setShowLangDropdown(false);
  };

  const handleRefresh = () => {
    fetchMovies(selectedLang);
  };

  const currentLang = MOVIE_LANGUAGES.find((l) => l.code === selectedLang) || MOVIE_LANGUAGES[0];

  return (
    <div className="movies-page" id="movies-page">
      <header className="movies-page__header">
        <button
          onClick={() => navigate("/dashboard")}
          className="movies-page__back"
          id="movies-back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1 className="movies-page__title">🎬 Entertainment</h1>
        <p className="movies-page__subtitle">
          Discover movies based on your interests
        </p>

        {/* Controls: Language Selector + Refresh */}
        <div className="movies-page__controls">
          {/* Language Dropdown */}
          <div className="movies-page__lang-wrap">
            <button
              className="movies-page__lang-btn"
              onClick={() => setShowLangDropdown((v) => !v)}
              id="lang-selector-btn"
            >
              <span className="movies-page__lang-flag">{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <svg className="movies-page__lang-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showLangDropdown && (
              <div className="movies-page__lang-dropdown" id="lang-dropdown">
                {MOVIE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`movies-page__lang-option ${
                      lang.code === selectedLang ? "movies-page__lang-option--active" : ""
                    }`}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {lang.code === selectedLang && <span className="movies-page__lang-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            className="movies-page__refresh-btn"
            onClick={handleRefresh}
            title="Refresh to get different movies"
            id="refresh-movies-btn"
          >
            🔄 Shuffle
          </button>
        </div>
      </header>

      {loading ? (
        <div className="movies-page__loading">
          <div className="movies-page__spinner"></div>
          <p>Fetching {currentLang.label} movies for your categories...</p>
        </div>
      ) : Object.keys(moviesByCategory).length === 0 ? (
        <div className="movies-page__empty">
          <span className="movies-page__empty-icon">🎞️</span>
          <p>No {currentLang.label} movies found for your selected categories.</p>
          <p className="movies-page__empty-hint">Try selecting a different language or categories.</p>
        </div>
      ) : (
        <div className="movies-page__content">
          {Object.entries(moviesByCategory).map(([category, movies]) => (
            <div key={category} className="movies-page__section">
              <h2 className="movies-page__section-title">
                {category}
                <span className="movies-page__section-count">{movies.length} titles</span>
              </h2>
              <div className="movies-page__scroll">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={setSelectedMovie}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Movies;
