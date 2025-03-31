import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ComingSoon({
  title,
  description,
  returnPath = "/admin/dashboard",
  returnLabel = "Back to Dashboard",
  estimatedTime = "Coming in the next update",
}) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-4">
        <Clock className="h-12 w-12 text-primary" />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>

      <div className="mb-8 inline-flex items-center rounded-full border border-dashed border-muted-foreground/30 px-4 py-2">
        <span className="text-sm text-muted-foreground">{estimatedTime}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="outline" onClick={() => navigate(returnPath)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {returnLabel}
        </Button>
        <Button
          onClick={() =>
            window.open("https://github.com/Nainee99/3legant", "_blank")
          }
        >
          Follow Our Progress
        </Button>
      </div>
    </div>
  );
}
