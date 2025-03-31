import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    </div>
  );
}
