require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");

// Create app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Movie routes
app.use("/api/movies", movieRoutes);

// Review routes
app.use("/api/reviews", reviewRoutes);

/* =========================
   SERVER + DB
========================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));