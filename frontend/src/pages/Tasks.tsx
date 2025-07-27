import { useState } from "react"
import { Layout } from "@/components/Layout"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { TaskCard } from "@/components/TaskCard"
import { TaskNotesDialog } from "@/components/TaskNotesDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Update landing page design",
    description: "Revamp the main landing page with new branding and improved UX",
    status: "IN_PROGRESS",
    assignee: "Sarah Wilson",
    createdDate: "2024-01-10",
    dueDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Fix authentication bug",
    description: "Users are unable to login with Google OAuth",
    status: "PENDING",
    assignee: "Mike Johnson",
    createdDate: "2024-01-12",
    dueDate: "2024-01-18"
  },
  {
    id: 3,
    title: "Implement user dashboard",
    description: "Create a comprehensive dashboard for user analytics",
    status: "COMPLETED",
    assignee: "Emily Davis",
    createdDate: "2024-01-08",
    dueDate: "2024-01-12"
  },
  {
    id: 4,
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples",
    status: "IN_PROGRESS",
    assignee: "Alex Chen",
    createdDate: "2024-01-14",
    dueDate: "2024-01-20"
  },
  {
    id: 5,
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment",
    status: "PENDING",
    assignee: "John Doe",
    createdDate: "2024-01-13",
    dueDate: "2024-01-22"
  },
  {
    id: 6,
    title: "Database migration",
    description: "Migrate from PostgreSQL to MongoDB",
    status: "PENDING",
    assignee: "Sarah Wilson",
    createdDate: "2024-01-11",
    dueDate: "2024-01-25"
  }
]

export default function Tasks() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleTaskClick = (task: typeof tasks[0]) => {
    setSelectedTask(task)
    setNotesDialogOpen(true)
  }

  const handleStatusChange = (taskId: number, newStatus: string) => {
    // Handle status update logic here
    console.log("Update task status:", taskId, newStatus)
  }

  return (
    <Layout 
      userRole="MANAGER" 
      userName="John Doe"
      onCreateTask={() => setCreateTaskOpen(true)}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all workspace tasks
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              userRole="MANAGER"
              onClick={() => handleTaskClick(task)}
              onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found matching your criteria.</p>
          </div>
        )}

        {/* Dialogs */}
        <CreateTaskDialog 
          open={createTaskOpen} 
          onOpenChange={setCreateTaskOpen}
        />
        
        <TaskNotesDialog
          open={notesDialogOpen}
          onOpenChange={setNotesDialogOpen}
          task={selectedTask}
        />
      </div>
    </Layout>
  )
}