import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AppHeader } from "@/components/AppHeader"

interface LayoutProps {
  children: ReactNode
  userRole?: "MANAGER" | "TEAM"
  userName?: string
  onCreateTask?: () => void
  onLogout?: () => void
}

export function Layout({ 
  children, 
  userRole, 
  userName, 
  onCreateTask, 
  onLogout 
}: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader 
            userRole={userRole}
            userName={userName}
            onCreateTask={onCreateTask}
            onLogout={onLogout}
          />
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}