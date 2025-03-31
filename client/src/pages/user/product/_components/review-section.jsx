"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RatingSummary from "./rating-summary";
import ReviewList from "./review-list";
import ReviewForm from "./review-form";
import { useReviewStore } from "@/store/useReviewStore";

export default function ReviewSection({ productId }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { reviews, pagination, getProductReviews, isLoading, error } =
    useReviewStore();

  useEffect(() => {
    if (productId) {
      getProductReviews(productId);
    }

    return () => {
      useReviewStore.getState().clearReviewsList();
    };
  }, [productId, getProductReviews]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    getProductReviews(productId);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <section id="reviews">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        {/* Rating Summary */}
        <RatingSummary
          averageRating={averageRating}
          totalReviews={reviews.length}
          reviews={reviews}
        />

        {/* Reviews and Form */}
        <div className="space-y-8">
          {!showReviewForm ? (
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
              </h3>
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <ReviewForm
                productId={productId}
                onCancel={() => setShowReviewForm(false)}
                onSuccess={handleReviewSuccess}
              />
            </div>
          )}

          {/* Review List */}
          {!showReviewForm && (
            <ReviewList reviews={reviews} isLoading={isLoading} error={error} />
          )}
        </div>
      </div>
    </section>
  );
}
