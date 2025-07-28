import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL, getAuthHeader } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "MANAGER" | "TEAM";
}

export function CreateTaskDialog({
  open,
  onOpenChange,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [workspaceNumber, setWorkspaceNumber] = useState<number | null>(
    user?.workspaceNumber || null
  );

  // Fetch team members when dialog opens
  useEffect(() => {
    if (open) {
      fetchTeamMembers();
    }
  }, [open]);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/user`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok && data.workspace) {
        setTeamMembers(data.workspace.members || []);
        setWorkspaceNumber(data.workspace.workspaceNumber);
      }
    } catch (err) {
      console.error("Failed to fetch team members", err);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !assignedToId || !workspaceNumber) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields and ensure you have a workspace",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        title,
        description,
        assignedToId,
        workspaceNumber: Number(workspaceNumber),
      };

      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Task created successfully",
        });

        // Reset form
        setTitle("");
        setDescription("");
        setAssignedToId("");

        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: data.errors || data.msg || "Failed to create task",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Create task error:", err);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to a team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To *</Label>
            <Select
              value={assignedToId}
              onValueChange={setAssignedToId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
