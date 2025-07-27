import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Building2,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, getAuthHeader } from "@/lib/api";

interface Workspace {
  name: string;
  workspaceNumber: number;
}

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Team", url: "/team", icon: Users },
  { title: "Workspace", url: "/workspace", icon: Building2 },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const isCollapsed = state === "collapsed";

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-accent text-accent-foreground font-medium border-l-2 border-primary"
      : "hover:bg-accent/80 text-sidebar-foreground";

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!user.workspaceNumber) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/workspaces/${user.workspaceNumber}`,
          {
            headers: getAuthHeader(),
          }
        );

        if (res.ok) {
          const data = await res.json();
          setWorkspace(data.workspace);
        }
      } catch (err) {
        console.error("Failed to load workspace", err);
      }
    };

    fetchWorkspace();
  }, [user.workspaceNumber]);

  return (
    <Sidebar
      className={`${
        isCollapsed ? "w-14" : "w-64"
      } bg-sidebar-background border-r border-sidebar-border`}
      collapsible="icon"
    >
      {/* Header with Logo and Toggle */}
      <SidebarHeader className="border-b border-sidebar-border px-3 py-[10px] bg-sidebar-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://static.wixstatic.com/media/80c3b4_149980527852400b8a6edbb44e46ac40~mv2.webp/v1/fill/w_124,h_87,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PNG%20LOGO-5%20(1).webp"
                alt="Abhiwan Technology"
                className="h-8 w-8 object-contain filter invert"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-sidebar-foreground">
                  Abhiwan
                </h1>
                <p className="text-xs text-muted-foreground">Technology</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 shrink-0 hover:bg-sidebar-accent text-sidebar-foreground"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 bg-sidebar-background mt-4">
        {/* Workspace Section */}
        {workspace && (
          <SidebarGroup>
            <Collapsible open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="group/collapsible hover:bg-sidebar-accent text-sidebar-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span>My Workspace</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </>
                    )}
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      {!isCollapsed &&
                        `${workspace.name} #${workspace.workspaceNumber}`}
                    </p>
                  </div>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
