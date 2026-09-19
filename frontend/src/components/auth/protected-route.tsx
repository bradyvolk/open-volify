import { Navigate, Outlet } from "react-router";
import { authClient } from "@/lib/auth-client";

export function ProtectedRoute() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
