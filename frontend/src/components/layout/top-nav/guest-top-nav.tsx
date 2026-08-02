import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import logoLarge from "@/assets/open-volify-logo-large.png";

const MARKETING_SITE_URL = "https://open-volify.org";

export function GuestTopNav() {
  const currentRoute = location.pathname;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-24 items-center justify-between">
        <a href={MARKETING_SITE_URL} className="flex items-center gap-2">
          <img src={logoLarge} alt="OpenVolify" className="h-10 w-auto" />
        </a>

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
  );
}
