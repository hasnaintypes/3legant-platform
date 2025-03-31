"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CharacterLimitTextarea } from "./character-limit-textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function FeedbackForm({ userName }) {
  const [feedback, setFeedback] = useState({
    rating: [3],
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (value) => {
    setFeedback({ ...feedback, rating: value });
    if (submitted) setSubmitted(false);
  };

  const handleCommentsChange = (value) => {
    setFeedback({ ...feedback, comments: value });
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted", feedback);
    setSubmitted(true);
  };

  const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"];

  return (
    <div className="space-y-6">
      {submitted && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Thank you for your feedback, {userName.split(" ")[0]}! We appreciate
            your input.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Label className="leading-6">Rate your experience</Label>
            <span className="text-sm font-medium">
              {labels[feedback.rating[0] - 1]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">😡</span>
            <Slider
              value={feedback.rating}
              onValueChange={handleRatingChange}
              min={1}
              max={5}
              step={1}
              aria-label="Rate your experience"
            />
            <span className="text-2xl">😍</span>
          </div>
        </div>

        <CharacterLimitTextarea
          label="Tell us about your experience"
          maxLength={180}
          value={feedback.comments}
          onChange={handleCommentsChange}
          placeholder="Share your thoughts and suggestions..."
        />

        <Button type="submit">Submit Feedback</Button>
      </form>
    </div>
  );
}
