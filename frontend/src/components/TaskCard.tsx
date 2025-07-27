import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, User, Edit, Trash2 } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  status: string
  assignee: string
  createdDate: string
  dueDate?: string
}

interface TaskCardProps {
  task: Task
  userRole: "MANAGER" | "TEAM"
  onClick?: () => void
  onStatusChange?: (newStatus: string) => void
  onEdit?: () => void
  onDelete?: () => void
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>
    case "IN_PROGRESS":
      return <Badge variant="default" className="bg-warning text-warning-foreground">In Progress</Badge>
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function TaskCard({ 
  task, 
  userRole, 
  onClick, 
  onStatusChange, 
  onEdit, 
  onDelete 
}: TaskCardProps) {
  const canManage = userRole === "MANAGER"
  const isAssigned = userRole === "TEAM" // In real app, check if current user is assigned

  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {task.description}
            </CardDescription>
          </div>
          
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.() }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          {getStatusBadge(task.status)}
          
          {(canManage || isAssigned) && (
            <Select 
              value={task.status} 
              onValueChange={(value) => {
                onStatusChange?.(value)
              }}
            >
              <SelectTrigger 
                className="w-32 h-8 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{task.assignee}</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due {task.dueDate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}