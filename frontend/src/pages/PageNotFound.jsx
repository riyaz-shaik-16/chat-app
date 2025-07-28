import React from "react";
import { Ghost } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center border-muted">
        <CardContent className="py-12 space-y-6">
          <div className="flex justify-center">
            <Ghost className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-muted-foreground text-base">
            The page you're looking for is lost in space.
          </p>
          <Link to="/">
            <Button variant="outline" className="mt-4 cursor-pointer">
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageNotFound;
