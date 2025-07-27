import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, MessageSquare, Plus } from "lucide-react";
import "../index.css";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee: string;
  createdDate: string;
  dueDate?: string;
}

interface TaskNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

const mockNotes = [
  {
    id: 1,
    content: "Started working on the design mockups. Initial wireframes are complete.",
    author: "Sarah Wilson",
    createdAt: "2024-01-14T10:30:00Z",
    avatar: "",
  },
  {
    id: 2,
    content: "Reviewed the wireframes with the team. Making adjustments based on feedback.",
    author: "John Doe",
    createdAt: "2024-01-14T14:15:00Z",
    avatar: "",
  },
  {
    id: 3,
    content: "Color palette and typography decisions finalized. Moving to high-fidelity designs.",
    author: "Sarah Wilson",
    createdAt: "2024-01-15T09:20:00Z",
    avatar: "",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="default" className="bg-warning text-warning-foreground">In Progress</Badge>;
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function TaskNotesDialog({ open, onOpenChange, task }: TaskNotesDialogProps) {
  const [newNote, setNewNote] = useState("");

  if (!task) return null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    console.log("Add note:", newNote);
    setNewNote("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] w-full flex flex-col p-4  sm:p-8 lg:p-8 overflow-hidden rounded-xl"
      >
        <DialogHeader className="mb-2">
          <div className="flex gap-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
              {task.title}
            </DialogTitle>
            {getStatusBadge(task.status)}
          </div>
          <DialogDescription className="text-sm truncate mt-1">
            {task.description}
          </DialogDescription>
        </DialogHeader>

        {/* Main content */}
        <div className="flex-1 flex flex-col space-y-4 overflow-auto px-1 sm:px-3 custom-scrollbar">
          {/* Task Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Assigned to:</span>
              <span className="font-medium truncate">{task.assignee}</span>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span className="font-medium truncate">{task.dueDate}</span>
              </div>
            )}
          </div>

          {/* Progress Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <h3 className="font-medium text-sm">Progress Notes</h3>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {mockNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex gap-3 p-3 border rounded-lg bg-background"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={note.avatar} alt={note.author} />
                    <AvatarFallback className="text-xs">
                      {getInitials(note.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{note.author}</span>
                      <span className="text-xs text-muted-foreground truncate">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-sm break-words">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Note + Close Button */}
          <div className="pt-4 sticky bottom-0 bg-background z-10 space-y-2">
            <label className="text-sm font-medium">Add Progress Note</label>
            <Textarea
              placeholder="Share an update on this task..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="resize-none min-h-[60px]"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
                Close
              </Button>
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
      </DialogContent>
    </Dialog>
  );
}
