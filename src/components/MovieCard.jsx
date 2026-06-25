import React from "react";
import { TMDB_IMAGE_BASE } from "../services/api";
import "./MovieCard.css";

const MovieCard = ({ movie, onClick }) => {
  const poster = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  const year = movie.release_date ? movie.release_date.split("-")[0] : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="movie-card" onClick={() => onClick(movie)} id={`movie-card-${movie.id}`}>
      <div className="movie-card__poster-wrap">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="movie-card__poster"
            loading="lazy"
          />
        ) : (
          <div className="movie-card__no-poster">
            <span>🎬</span>
            <span className="movie-card__no-poster-text">{movie.title}</span>
          </div>
        )}
        <div className="movie-card__overlay">
          <span className="movie-card__view">View Details</span>
        </div>
        {rating && (
          <div className="movie-card__rating">
            ⭐ {rating}
          </div>
        )}
      </div>
      <div className="movie-card__info">
        <h4 className="movie-card__title">{movie.title}</h4>
        {year && <span className="movie-card__year">{year}</span>}
      </div>
    </div>
  );
};

export default MovieCard;
