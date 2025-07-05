import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate("/chat")} variant="default">
        Go Home
      </Button>
    </div>
  );
};

export default PageNotFound;
