import { Star } from "lucide-react";

export default function RatingSummary({
  averageRating,
  totalReviews,
  reviews = [],
}) {
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });

  return (
    <div className="space-y-6 bg-muted/30 p-6 rounded-lg">
      <div className="text-center">
        <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
        <div className="flex justify-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= averageRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Based on {totalReviews} reviews
        </div>
      </div>

      {/* Rating distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating, index) => {
          const count = ratingCounts[5 - rating];
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center w-12">
                <span>{rating}</span>
                <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-10 text-xs text-right text-muted-foreground">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
