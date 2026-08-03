import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { FolderKanban, Building2, Users } from "lucide-react";

export function LeftNav() {
  const location = useLocation();

  const navItems = [
    {
      label: "People",
      path: "/platform/people",
      icon: Users,
    },
    {
      label: "Projects",
      path: "/platform/projects",
      icon: FolderKanban,
    },
    {
      label: "Organizations",
      path: "/platform/organizations",
      icon: Building2,
    },
  ];

  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
