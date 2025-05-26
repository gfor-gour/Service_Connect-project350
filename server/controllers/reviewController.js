const Review = require("../models/Review")
const User = require("../models/User")
const mongoose = require("mongoose")

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { userId, providerId, rating, comment } = req.body

    // Validate that the provider exists and is actually a provider
    const provider = await User.findOne({ _id: providerId, role: "provider" })
    if (!provider) {
      return res.status(400).json({
        message: "Provider not found",
      })
    }

    // Check if user has already reviewed this provider
    const existingReview = await Review.findOne({ userId, providerId })
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this provider",
      })
    }

    // Create the review
    const review = new Review({
      userId,
      providerId,
      rating,
      comment,
    })

    await review.save()

    // Populate the review with user details
    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name profilePicture")
      .populate("providerId", "name")

    res.status(201).json({
      message: "Review created successfully",
      review: populatedReview,
    })
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ error: error.message })
  }
}

// Get all reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ providerId })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalReviews = await Review.countDocuments({ providerId })

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ])

    const averageRating = ratingStats[0]?.avgRating || 0

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
    })
  } catch (error) {
    console.error("Error fetching provider reviews:", error)
    res.status(500).json({ error: error.message })
  }
}

// Check if user can review a provider (hasn't reviewed yet)
exports.canUserReview = async (req, res) => {
  try {
    const { userId, providerId } = req.params

    const existingReview = await Review.findOne({ userId, providerId })

    res.status(200).json({
      canReview: !existingReview,
      hasReviewed: !!existingReview,
    })
  } catch (error) {
    console.error("Error checking review status:", error)
    res.status(500).json({ error: error.message })
  }
}

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment, userId } = req.body

    const review = await Review.findOne({ _id: reviewId, userId: userId })
    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" })
    }

    review.rating = rating
    review.comment = comment
    await review.save()

    const updatedReview = await Review.findById(reviewId)
      .populate("userId", "name profilePicture")
      .populate("providerId", "name")

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    })
  } catch (error) {
    console.error("Error updating review:", error)
    res.status(500).json({ error: error.message })
  }
}

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { userId } = req.body

    const review = await Review.findOneAndDelete({ _id: reviewId, userId: userId })
    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" })
    }

    res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    res.status(500).json({ error: error.message })
  }
}

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params

    const reviews = await Review.find({ userId })
      .populate("providerId", "name workType profilePicture")
      .sort({ createdAt: -1 })

    res.status(200).json({ reviews })
  } catch (error) {
    console.error("Error fetching user reviews:", error)
    res.status(500).json({ error: error.message })
  }
}
