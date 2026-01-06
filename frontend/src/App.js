import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const res = await axios.get("http://localhost:5000/movies");
    setMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const addMovie = async () => {
    if (!title || !review || !rating) {
      alert("Please fill all fields");
      return;
    }

    await axios.post("http://localhost:5000/addMovie", {
      title,
      review,
      rating
    });

    setTitle("");
    setReview("");
    setRating("");
    fetchMovies();
  };

  return (
    <div className="container">
      <h1>🎬 Movie Review & Rating</h1>

      <input
        placeholder="Movie Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Your Review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <input
        type="number"
        placeholder="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <button onClick={addMovie}>Add Review</button>

      <hr />

      {movies.map((movie, index) => (
        <div key={index} className="movie-card">
          <h3>{movie.title}</h3>
          <p>{movie.review}</p>
          <strong>⭐ {movie.rating} / 5</strong>
        </div>
      ))}
    </div>
  );
}

export default App;
