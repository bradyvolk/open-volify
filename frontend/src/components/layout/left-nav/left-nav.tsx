import { useEffect, useState } from "react";
import { ChevronRight, FolderKanban, Building2, Users, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    label: "Team",
    icon: Users,
    subItems: [
      { label: "People", path: "/platform/people" },
      { label: "Groups", path: "/platform/groups" },
    ],
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

function isPathActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(path + "/");
}

interface NavGroupItemProps {
  label: string;
  icon: LucideIcon;
  subItems: { label: string; path: string }[];
  pathname: string;
}

function NavGroupItem({ label, icon: Icon, subItems, pathname }: NavGroupItemProps) {
  const isGroupActive = subItems.some((subItem) => isPathActive(pathname, subItem.path));
  const [open, setOpen] = useState(isGroupActive);

  useEffect(() => {
    if (isGroupActive) {
      setOpen(true);
    }
  }, [isGroupActive]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={isGroupActive && !open}>
            <Icon />
            <span>{label}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-1 py-1">
            {subItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.path}>
                <SidebarMenuSubButton asChild isActive={isPathActive(pathname, subItem.path)}>
                  <Link to={subItem.path}>{subItem.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function LeftNav() {
  const location = useLocation();

  return (
    <Sidebar className="top-[65px] h-[calc(100svh-65px)]">
      <SidebarContent>
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;

                if (item.subItems) {
                  return (
                    <NavGroupItem
                      key={item.label}
                      label={item.label}
                      icon={Icon}
                      subItems={item.subItems}
                      pathname={location.pathname}
                    />
                  );
                }

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isPathActive(location.pathname, item.path)}
                    >
                      <Link to={item.path}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
