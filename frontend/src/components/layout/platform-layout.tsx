import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LeftNav } from "./left-nav/left-nav";

export function PlatformLayout() {
  return (
    <SidebarProvider>
      <LeftNav />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
