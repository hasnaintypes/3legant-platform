"use client";

import { useState } from "react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStore } from "@/store/useReviewStore";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewList({ reviews = [], isLoading, error }) {
  const [sortOption, setSortOption] = useState("newest");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const { updateReview, deleteReview } = useReviewStore();

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const visibleReviewsList = sortedReviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < sortedReviews.length;

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleUpdateReview = async () => {
    try {
      const result = await updateReview(editingReview._id, {
        rating: editRating,
        comment: editComment,
      });

      if (result) {
        toast.success("Review updated successfully");
        handleCancelEdit();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const result = await deleteReview(reviewId);
        if (result) {
          toast.success("Review deleted successfully");
        }
      } catch (error) {
        toast.error(error.message || "Failed to delete review");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visibleReviewsList.length > 0 ? (
        <div className="space-y-4">
          {visibleReviewsList.map((review) => (
            <div
              key={review._id}
              className="border rounded-lg p-4 space-y-2 hover:border-primary/50 transition-colors"
            >
              {editingReview?._id === review._id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-5 w-5 ${star <= editRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Comment</label>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateReview}>Save</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{review.user?.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.isOwner && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(review)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(review._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </>
              )}
            </div>
          ))}

          {hasMoreReviews && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={loadMoreReviews}
            >
              Load More Reviews
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}
