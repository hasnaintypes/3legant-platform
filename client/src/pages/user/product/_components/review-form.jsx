"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStore } from "@/store/useReviewStore";
import { toast } from "sonner";

export default function ReviewForm({ productId, onCancel, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { createReview, isLoading } = useReviewStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      const result = await createReview({
        productId,
        rating,
        comment,
      });

      if (result) {
        toast.success("Thank you for your review!");
        setRating(0);
        setComment("");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to submit review. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="rating" className="block text-sm font-medium">
          Your Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium">
          Your Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
