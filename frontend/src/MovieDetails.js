import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "./context/ThemeContext";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

const API_URL = "https://movie-review-mern.onrender.com/api";

function MovieDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
      fetchReviews();
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/${id}`);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to submit a review");
      return;
    }

    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${API_URL}/reviews`,
        {
          movieId: id,
          rating: userRating,
          review: reviewText.trim(),
          userName: user.name || user.email || "Anonymous"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Add new review to the list
      setReviews([response.data, ...reviews]);
      
      // Reset form
      setUserRating(0);
      setReviewText("");
      
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.error || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`movie-details-page ${theme}`} style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "24px", color: theme === "dark" ? "#ccc" : "#333" }}>Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`page-center ${theme}`}>
        <h2>Movie not found</h2>
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`movie-details-page ${theme}`}>
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <div className="movie-details-container">
        <div className="movie-poster-wrapper">
          <img
            src={movie.image || "https://via.placeholder.com/400x600?text=Movie+Poster"}
            alt={movie.title}
            className="movie-poster"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600?text=Movie+Poster";
            }}
          />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta">
            {movie.year && <span className="meta-item">{movie.year}</span>}
            {movie.runtime && <span className="meta-item">{movie.runtime}</span>}
            {movie.genre && <span className="meta-item">{movie.genre}</span>}
          </div>

          <div className="rating-section">
            <div className="stars-large">
              {"★".repeat(movie.rating || 5)}
              {"☆".repeat(5 - (movie.rating || 5))}
            </div>
            <span className="rating-text">{movie.rating || 5} / 5</span>
          </div>

          {movie.director && (
            <div className="info-row">
              <span className="info-label">Director:</span>
              <span className="info-value">{movie.director}</span>
            </div>
          )}

          <div className="description-section">
            <h3>Synopsis</h3>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Rating & Review Section */}
      <div className="review-section">
        <h2>Rate & Review</h2>
        
        {user ? (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-input">
              <label>Your Rating:</label>
              <div className="interactive-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || userRating) ? 'filled' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-value">
                  {userRating > 0 ? `${userRating} / 5` : 'Select rating'}
                </span>
              </div>
            </div>

            <div className="review-input">
              <label>Your Review:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                rows="5"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please login to rate and review this movie</p>
            <button onClick={() => navigate("/")} className="login-btn">
              Go to Login
            </button>
          </div>
        )}

        {/* Display All Reviews */}
        <div className="all-reviews">
          <h3>All Reviews ({reviews.length})</h3>
          
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="review-user">
                      <span className="user-avatar">👤</span>
                      <span className="user-name">{review.userName || "Anonymous"}</span>
                    </div>
                    <div className="review-rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                      <span className="rating-number">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="review-text">{review.review}</p>
                  {review.createdAt && (
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;