import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import MovieDetails from "./MovieDetails";
import Reviews from "./Reviews";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/reviews" element={<Reviews />} />
    </Routes>
  );
}

export default App;
