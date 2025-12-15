import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoLarge from "@/assets/open-volify-logo-large.png";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const location = useLocation();

  const currentRoute = location.pathname;
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoLarge} alt="OpenVolify" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-6">
              <a
                href="#platform"
                className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Platform
              </a>

              <Link
                to="/about"
                className={cn(
                  "text-md font-medium transition-colors hover:text-foreground",
                  isActive("/about")
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                About OpenVolify
              </Link>
              <a
                href="#community"
                className="text-md font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Community
              </a>
            </div>

            <div className="flex min-w-[100px]">
              {currentRoute !== "/sign-in" && (
                <Link to="/sign-in" className="w-full flex">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
              {currentRoute === "/sign-in" && (
                <Link to="/sign-up" className="w-full flex">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
