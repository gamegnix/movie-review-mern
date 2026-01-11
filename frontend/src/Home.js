import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { ThemeContext } from "./context/ThemeContext";
import MovieCard from "./MovieCard";
import LoginModal from "./LoginModal";
import "./App.css";

const API_URL = "https://movie-review-mern.onrender.com/api";

function Home() {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/movies`);
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        // Fallback to empty array if API fails
        setMovies([]);
        setFilteredMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = movies.filter((movie) => {
      const title = (movie.title || "").toLowerCase();
      const genre = (movie.genre || "").toLowerCase();
      const director = (movie.director || "").toLowerCase();
      const description = (movie.description || "").toLowerCase();
      const year = (movie.year || "").toString();

      return (
        title.includes(query) ||
        genre.includes(query) ||
        director.includes(query) ||
        description.includes(query) ||
        year.includes(query)
      );
    });

    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  useEffect(() => {
    // Check if user is logged in from localStorage on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        login(userData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleReviewClick = (movie) => {
    if (!isLoggedIn && !user) {
      setSelectedMovie(movie);
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        login(userData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    login(null);
    setIsLoggedIn(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className={`app-container ${theme}`} style={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div style={{ fontSize: "24px", color: theme === "dark" ? "#ccc" : "#333", marginTop: "20px" }}>
            Loading movies...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}`}>
      <header className={`header-${theme}`}>
        <h1 className="site-title">
          <span className="title-icon">🎬</span>
          Movie Rating
        </h1>
        <div className="header-actions">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {isLoggedIn || user ? (
            <>
              <span className="welcome-text">Welcome, {user?.name || user?.email || "User"}!</span>
              <button className="header-btn" onClick={() => navigate("/reviews")}>My Reviews</button>
              <button className="header-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="header-btn primary" onClick={() => setShowLoginModal(true)}>
              Login / Sign Up
            </button>
          )}
        </div>
      </header>

      <div className={`search-section search-${theme}`}>
        <div className="search-container">
          <div className="search-box">
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for movies, genres, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="search-results-info">
              Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <div className={`movie-grid movie-grid-${theme}`}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id || movie.tmdbId}
              movie={movie}
              onReview={handleReviewClick}
              isLoggedIn={isLoggedIn || !!user}
            />
          ))
        ) : (
          <div className="no-results">
            <h2>{searchQuery ? "No movies found" : "No movies available"}</h2>
            <p>
              {searchQuery
                ? `Try searching for something else or clear your search.`
                : "Please check your API connection."}
            </p>
            {searchQuery && (
              <button onClick={handleClearSearch} className="clear-search-button">
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            setSelectedMovie(null);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <footer className={`footer-${theme}`}>
        <p>Alameen Shajahan - All Rights Reserved 2026</p>
      </footer>
    </div>
  );
}

export default Home;
