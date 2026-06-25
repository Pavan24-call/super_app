import React, { useEffect, useState } from "react";
import { fetchTMDBMovieDetails, TMDB_IMAGE_BASE } from "../services/api";
import "./MovieModal.css";

const MovieModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movie?.id) {
      setLoading(true);
      fetchTMDBMovieDetails(movie.id)
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch(() => {
          setDetails(null);
          setLoading(false);
        });
    }
  }, [movie]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const poster = details?.poster_path
    ? `${TMDB_IMAGE_BASE}${details.poster_path}`
    : movie?.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  const castList = details?.credits?.cast
    ? details.credits.cast.slice(0, 8).map((c) => c.name).join(", ")
    : null;

  const directorList = details?.credits?.crew
    ? details.credits.crew
        .filter((c) => c.job === "Director")
        .map((c) => c.name)
        .join(", ")
    : null;

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} id="movie-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} id="modal-close-btn">
          ✕
        </button>

        {loading ? (
          <div className="modal-loading">
            <div className="modal-spinner"></div>
            <p>Loading movie details...</p>
          </div>
        ) : details ? (
          <div className="modal-body">
            {poster && (
              <div className="modal-poster-section">
                <img src={poster} alt={details.title} className="modal-poster" />
              </div>
            )}
            <div className="modal-details-section">
              <h2 className="modal-title">{details.title}</h2>
              {details.tagline && (
                <p className="modal-tagline">"{details.tagline}"</p>
              )}

              <div className="modal-meta">
                {details.release_date && (
                  <span className="modal-tag">{details.release_date.split("-")[0]}</span>
                )}
                {details.runtime > 0 && (
                  <span className="modal-tag">{formatRuntime(details.runtime)}</span>
                )}
                {details.original_language && (
                  <span className="modal-tag">{details.original_language.toUpperCase()}</span>
                )}
                {details.status && (
                  <span className="modal-tag">{details.status}</span>
                )}
              </div>

              {details.genres && details.genres.length > 0 && (
                <div className="modal-genres">
                  {details.genres.map((g) => (
                    <span key={g.id} className="modal-genre">{g.name}</span>
                  ))}
                </div>
              )}

              {details.vote_average > 0 && (
                <div className="modal-rating">
                  <span className="modal-rating__star">⭐</span>
                  <span className="modal-rating__value">{details.vote_average.toFixed(1)}</span>
                  <span className="modal-rating__max">/10</span>
                  {details.vote_count > 0 && (
                    <span className="modal-rating__votes">
                      ({details.vote_count.toLocaleString()} votes)
                    </span>
                  )}
                </div>
              )}

              {details.overview && (
                <div className="modal-section">
                  <h4 className="modal-section__title">Plot</h4>
                  <p className="modal-section__text">{details.overview}</p>
                </div>
              )}

              {directorList && (
                <div className="modal-section">
                  <h4 className="modal-section__title">Director</h4>
                  <p className="modal-section__text">{directorList}</p>
                </div>
              )}

              {castList && (
                <div className="modal-section">
                  <h4 className="modal-section__title">Cast</h4>
                  <p className="modal-section__text">{castList}</p>
                </div>
              )}

              {details.production_companies && details.production_companies.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section__title">Production</h4>
                  <p className="modal-section__text">
                    {details.production_companies.map((p) => p.name).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="modal-loading">
            <p>Failed to load movie details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
