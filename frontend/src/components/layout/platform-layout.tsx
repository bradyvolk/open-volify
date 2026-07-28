import { Outlet } from "react-router";
import { LeftNav } from "./left-nav/left-nav";

export function PlatformLayout() {
  return (
    <div className="flex min-h-screen">
      <LeftNav />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
