"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  providerId: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Provider {
  _id: string;
  name: string;
  workType: string;
  profilePicture?: string;
}

export default function ReviewsPage() {
  const { userId } = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId_current = localStorage.getItem("userId");
        setCurrentUserId(userId_current);

        // Fetch provider details
        const providerResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (providerResponse.ok) {
          const providerData = await providerResponse.json();
          setProvider(providerData);
        }

        // Fetch provider reviews
        const reviewsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/provider/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews);
          setAverageRating(reviewsData.averageRating);
          setTotalReviews(reviewsData.totalReviews);
        }

        // Check if current user can review this provider
        if (userId_current && userId_current !== userId) {
          const canReviewResponse = await fetch(
            `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/can-review/${userId_current}/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (canReviewResponse.ok) {
            const canReviewData = await canReviewResponse.json();
            setCanReview(canReviewData.canReview);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      alert("Please write a comment");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const url = editingReview
        ? `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/${editingReview._id}`
        : `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/create`;

      const method = editingReview ? "PUT" : "POST";

      const body = editingReview
        ? {
            rating: newReview.rating,
            comment: newReview.comment,
            userId: currentUserId,
          }
        : {
            userId: currentUserId,
            providerId: userId,
            rating: newReview.rating,
            comment: newReview.comment,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        if (editingReview) {
          // Update existing review
          setReviews((prev) =>
            prev.map((review) =>
              review._id === editingReview._id ? data.review : review
            )
          );
          setEditingReview(null);
        } else {
          // Add new review
          setReviews((prev) => [data.review, ...prev]);
          setCanReview(false);
          setTotalReviews((prev) => prev + 1);
        }

        setShowReviewForm(false);
        setNewReview({ rating: 5, comment: "" });
        alert(
          editingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );

        // Refresh to get updated average rating
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review._id !== reviewId));
        setTotalReviews((prev) => prev - 1);
        setCanReview(true);
        alert("Review deleted successfully!");
        // Refresh to get updated average rating
        window.location.reload();
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() =>
              interactive && onRatingChange && onRatingChange(star)
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out px-4 md:px-0 md:pt-14 ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          }`}
        >
          <div className="py-4 md:p-8 w-full max-w-none">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar onToggle={setIsSidebarCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out px-4 md:px-0 md:pt-14 ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <div className="py-4 md:p-8 w-full max-w-none">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
            {/* Left Column - Provider Info & Add Review */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Provider Header */}
              {provider && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      {provider.profilePicture ? (
                        <Image
                          src={provider.profilePicture || "/placeholder.svg"}
                          alt={provider.name}
                          width={80}
                          height={80}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-800 text-2xl font-semibold">
                          {provider.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        {provider.name}
                      </h1>
                      <p className="text-gray-600 mb-3">{provider.workType}</p>
                      <div className="flex flex-col items-center space-y-2">
                        {renderStars(Math.round(averageRating))}
                        <span className="text-gray-700 text-sm">
                          {averageRating.toFixed(1)} ({totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Review Section */}
              {canReview && currentUserId !== userId && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Write a Review
                  </h2>
                  {!showReviewForm ? (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Add Review
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Rating
                        </label>
                        <div className="flex justify-center">
                          {renderStars(newReview.rating, true, (rating) =>
                            setNewReview((prev) => ({ ...prev, rating }))
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Comment
                        </label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 text-gray-800 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder="Share your experience..."
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={handleSubmitReview}
                          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          {editingReview ? "Update Review" : "Submit Review"}
                        </button>
                        <button
                          onClick={() => {
                            setShowReviewForm(false);
                            setEditingReview(null);
                            setNewReview({ rating: 5, comment: "" });
                          }}
                          className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Reviews List */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Reviews ({totalReviews})
                </h2>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <Star className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Be the first to leave a review!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {review.userId.profilePicture ? (
                              <Image
                                src={
                                  review.userId.profilePicture ||
                                  "/placeholder.svg"
                                }
                                alt={review.userId.name}
                                width={48}
                                height={48}
                                className="object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-gray-800 text-lg font-semibold">
                                {review.userId.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex flex-col space-y-1">
                                <h4 className="font-semibold text-gray-800">
                                  {review.userId.name}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              {review.userId._id === currentUserId && (
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                  title="Delete review"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
