import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "better-auth";
import { Link, useNavigate } from "react-router-dom";
import { PanelsTopLeft, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";

export function UserProfileMenu({ user }: { user: User }) {
  const firstName = user.name.split(" ")[0];
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/");
  };

  const handleClickProjects = () => {
    navigate("/platform/projects");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {firstName}
          <CircleUser className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleClickProjects}>
          <PanelsTopLeft className="size-4" />
          Projects
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-4" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
