"use client";

export function Spinner({ className = "" }) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-muted border-t-primary h-8 w-8 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
