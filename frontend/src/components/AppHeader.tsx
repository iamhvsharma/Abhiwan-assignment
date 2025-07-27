import { Plus, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface AppHeaderProps {
  userRole?: "MANAGER" | "TEAM"
  userName?: string
  onCreateTask?: () => void
  onLogout?: () => void
}

export function AppHeader({ 
  userRole = "MANAGER", 
  userName = "John Doe",
  onCreateTask,
  onLogout 
}: AppHeaderProps) {
  const initials = userName
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase()

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger className="md:hidden" />
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {userRole === "MANAGER" && (
          <Button onClick={onCreateTask} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={userRole === "MANAGER" ? "default" : "secondary"} className="text-xs">
                    {userRole}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}