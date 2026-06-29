import { useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

import { MainTopNav } from "./main-top-nav";
import { PlatformTopNav } from "./platform-top-nav";

export function TopNav() {
  const location = useLocation();
  const { data, error, isPending } = authClient.useSession();
  const user = data?.user;

  const currentRoute = location.pathname;
  const isPlatformRoute = currentRoute.startsWith("/platform");

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {user && isPlatformRoute ? (
        <PlatformTopNav user={user} />
      ) : (
        <MainTopNav user={user} />
      )}
    </nav>
  );
}
