const express = require("express")
const {
  createReview,
  getProviderReviews,
  canUserReview,
  updateReview,
  deleteReview,
  getUserReviews,
} = require("../controllers/reviewController")

const router = express.Router()

// Create a new review
router.post("/create", createReview)

// Get all reviews for a provider
router.get("/provider/:providerId", getProviderReviews)

// Check if user can review a provider
router.get("/can-review/:userId/:providerId", canUserReview)

// Get user's reviews
router.get("/user/:userId", getUserReviews)

// Update a review
router.put("/:reviewId", updateReview)

// Delete a review
router.delete("/:reviewId", deleteReview)

module.exports = router
