import { ChevronRight, FolderKanban, Building2, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
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

export function LeftNav() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.subItems) {
              const isGroupActive = item.subItems.some(
                (subItem) => location.pathname === subItem.path,
              );

              return (
                <Collapsible
                  key={item.label}
                  defaultOpen={isGroupActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Icon />
                        <span>{item.label}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === subItem.path}
                            >
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

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                  <Link to={item.path}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
