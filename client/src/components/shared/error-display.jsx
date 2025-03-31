import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorDisplay({ message, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="max-w-md space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground">{message}</p>
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
