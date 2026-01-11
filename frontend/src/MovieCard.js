import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function MovieCard({ movie, onReview, isLoggedIn }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleReviewClick = () => {
    if (!isLoggedIn) {
      onReview(movie); // opens login popup
    } else {
      // Navigate to movie details page or reviews page
      navigate(`/movie/${movie.tmdbId || movie.id}`);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Use tmdbId if available, otherwise use id
  const movieId = movie.tmdbId || movie.id;

  return (
    <div className="movie-card">
      <div className="movie-card-image-wrapper">
        <img
          src={
            imageError || !movie.image
              ? "https://via.placeholder.com/300x450?text=Movie+Poster"
              : movie.image
          }
          alt={movie.title}
          onError={handleImageError}
          className="movie-card-image"
        />
        <div className="movie-card-overlay">
          <button
            className="overlay-button"
            onClick={() => navigate(`/movie/${movieId}`)}
          >
            View Details
          </button>
        </div>
      </div>

      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>

        <div className="stars">
          {"★".repeat(movie.rating || 5)}
          {"☆".repeat(5 - (movie.rating || 5))}
        </div>

        {movie.year && <p className="movie-year">{movie.year}</p>}

        <div className="card-buttons">
          <button
            className="card-button primary"
            onClick={() => navigate(`/movie/${movieId}`)}
          >
            View Details
          </button>

          <button
            className="card-button secondary"
            onClick={handleReviewClick}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;