const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/movieReviewDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Movie schema
const movieSchema = new mongoose.Schema({
  title: String,
  review: String,
  rating: Number
});

const Movie = mongoose.model("Movie", movieSchema);

// Add movie route
app.post("/addMovie", async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.send("Movie added successfully");
});

// Get all movies
app.get("/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
