import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { ThemeContext } from "./context/ThemeContext";
import "./App.css";

const API_URL = "https://movie-review-mern.onrender.com/api";

function Reviews() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/reviews/user/my-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from state
      setReviews(reviews.filter(r => r._id !== reviewId));
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  if (!user) {
    return (
      <div className={`page-center ${theme}`}>
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h2>Please login to view your reviews</h2>
          <p>You need to be logged in to access your reviews</p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`reviews-page ${theme}`}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`reviews-page ${theme}`}>
      <div className="reviews-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <div className="header-content">
          <h1>My Reviews</h1>
          <p className="reviews-count">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      <div className="reviews-container">
        {reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h2>No reviews yet</h2>
            <p>Start reviewing movies to see them here!</p>
            <button className="primary-btn" onClick={() => navigate("/")}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id} className="review-card-item">
                <div className="review-card-header">
                  <div className="review-rating-badge">
                    <span className="rating-number">{review.rating}</span>
                    <span className="rating-stars">{"★".repeat(review.rating)}</span>
                  </div>
                  <button 
                    className="delete-review-btn"
                    onClick={() => handleDeleteReview(review._id)}
                    title="Delete review"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="review-content">
                  <p className="review-text">"{review.review}"</p>
                </div>

                <div className="review-card-footer">
                  <div className="review-meta">
                    <span className="review-movie-id">Movie ID: {review.movieId}</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <button 
                    className="view-movie-btn"
                    onClick={() => navigate(`/movie/${review.movieId}`)}
                  >
                    View Movie →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className={`footer-${theme}`}>
        <p>Alameen Shajahan - All Rights Reserved 2026</p>
      </footer>
    </div>
  );
}

export default Reviews;