import { Outlet } from "react-router";
import { SidebarInset } from "@/components/ui/sidebar";
import { LeftNav } from "./left-nav/left-nav";

export function PlatformLayout() {
  return (
    <div className="flex w-full">
      <LeftNav />
      <SidebarInset className="min-w-0">
        <Outlet />
      </SidebarInset>
    </div>
  );
}
