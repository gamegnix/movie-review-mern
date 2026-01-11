const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// POST: Create a new review (requires authentication)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { movieId, rating, review, userName } = req.body;

    if (!movieId || !rating || !review) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const newReview = new Review({
      movieId,
      userId: req.user.id,
      userName: userName || "Anonymous",
      rating,
      review
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
});

// GET: Get all reviews for a specific movie
router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// GET: Get all reviews by a specific user (requires authentication)
router.get("/user/my-reviews", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});

// DELETE: Delete a review (requires authentication)
router.delete("/:reviewId", authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user owns this review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own reviews" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;