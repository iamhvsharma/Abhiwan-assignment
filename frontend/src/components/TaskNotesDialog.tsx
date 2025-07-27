import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, MessageSquare, Plus } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  status: string
  assignee: string
  createdDate: string
  dueDate?: string
}

interface TaskNotesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
}

const mockNotes = [
  {
    id: 1,
    content: "Started working on the design mockups. Initial wireframes are complete.",
    author: "Sarah Wilson",
    createdAt: "2024-01-14T10:30:00Z",
    avatar: ""
  },
  {
    id: 2,
    content: "Reviewed the wireframes with the team. Making adjustments based on feedback.",
    author: "John Doe",
    createdAt: "2024-01-14T14:15:00Z",
    avatar: ""
  },
  {
    id: 3,
    content: "Color palette and typography decisions finalized. Moving to high-fidelity designs.",
    author: "Sarah Wilson",
    createdAt: "2024-01-15T09:20:00Z",
    avatar: ""
  }
]

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

export function TaskNotesDialog({ open, onOpenChange, task }: TaskNotesDialogProps) {
  const [newNote, setNewNote] = useState("")

  if (!task) return null

  const handleAddNote = () => {
    if (!newNote.trim()) return
    
    // Handle adding note logic here
    console.log("Add note:", newNote)
    setNewNote("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="flex-1">{task.title}</span>
            {getStatusBadge(task.status)}
          </DialogTitle>
          <DialogDescription>
            {task.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Assigned to:</span>
              <span className="font-medium">{task.assignee}</span>
            </div>
            
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span className="font-medium">{task.dueDate}</span>
              </div>
            )}
          </div>

          {/* Progress Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <h3 className="font-medium">Progress Notes</h3>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-3">
              {mockNotes.map((note) => (
                <div key={note.id} className="flex gap-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={note.avatar} alt={note.author} />
                    <AvatarFallback className="text-xs">
                      {getInitials(note.author)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{note.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Note */}
          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-medium">Add Progress Note</label>
            <div className="space-y-2">
              <Textarea
                placeholder="Share an update on this task..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}