import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">OpenVolify</span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#platform"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Platform
            </a>

            <Link
              to="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                isActive("/about") ? "text-foreground" : "text-muted-foreground"
              )}
            >
              About OpenVolify
            </Link>
            <a
              href="#community"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Community
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
