// Tasks.tsx
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { TaskCard } from "@/components/TaskCard";
import { TaskNotesDialog } from "@/components/TaskNotesDialog";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";
import { API_BASE_URL, getAuthHeader } from "@/lib/api";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: {
    id: string;
    name: string;
  };
  createdAt: string;
  dueDate?: string;
}

// Interface for TaskNotesDialog compatibility
interface TaskForDialog {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee: string;
  createdDate: string;
  dueDate?: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const { socket } = useSocket();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [workspaceNumber, setWorkspaceNumber] = useState<number | null>(
    user?.workspaceNumber || null
  );

  const fetchWorkspaceAndTasks = async () => {
    try {
      // First, get the user's workspace
      const workspaceRes = await fetch(`${API_BASE_URL}/workspaces/user`, {
        headers: getAuthHeader(),
      });

      if (workspaceRes.ok) {
        const workspaceData = await workspaceRes.json();
        const workspaceNum = workspaceData.workspace?.workspaceNumber;

        if (workspaceNum) {
          setWorkspaceNumber(workspaceNum);

          // Then fetch tasks for this workspace
          const tasksRes = await fetch(
            `${API_BASE_URL}/tasks/${workspaceNum}`,
            {
              headers: getAuthHeader(),
            }
          );

          if (tasksRes.ok) {
            const tasksData = await tasksRes.json();
            setTasks(tasksData.tasks || []);
          } else {
            throw new Error(`Failed to fetch tasks: ${tasksRes.status}`);
          }
        }
      } else {
        throw new Error(`Failed to fetch workspace: ${workspaceRes.status}`);
      }
    } catch (err) {
      console.error("Failed to fetch workspace and tasks", err);
      toast({
        title: "Error",
        description: "Failed to load workspace and tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceAndTasks();
  }, [toast]);

  // Socket integration for real-time updates
  useEffect(() => {
    if (!socket || !workspaceNumber) return;

    socket.emit("joinWorkspace", String(workspaceNumber));

    socket.on("task:created", (task: Task) => {
      setTasks((prev) => [task, ...prev]);
      toast({
        title: "New Task",
        description: `Task "${task.title}" was created`,
      });
    });

    socket.on("task:updated", (updated: Task) => {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast({
        title: "Task Updated",
        description: `Task "${updated.title}" was updated`,
      });
    });

    socket.on("task:deleted", ({ taskId }: { taskId: string }) => {
      setTasks((prev) => {
        const deletedTask = prev.find((t) => t.id === taskId);
        if (deletedTask) {
          toast({
            title: "Task Deleted",
            description: `Task "${deletedTask.title}" was deleted`,
          });
        }
        return prev.filter((t) => t.id !== taskId);
      });
    });

    socket.on("task:status", ({ taskId, status }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t))
      );
    });

    socket.on("task:note", ({ taskId, note }) => {
      console.log("Received task:note event:", { taskId, note });
      // Update the task's notes if we're viewing it
      if (selectedTask && selectedTask.id === taskId) {
        // Trigger a re-render of the dialog to show new note
        setSelectedTask((prev) => (prev ? { ...prev } : null));
      }
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("task:status");
      socket.off("task:note");
    };
  }, [socket, workspaceNumber, toast]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setNotesDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/status`, {
        method: "PATCH",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Failed",
          description: data.msg || "Couldn't update task status",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.msg || "Failed to delete task",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Delete task error:", err);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const getStatusCounts = () => {
    const counts = {
      ALL: tasks.length,
      PENDING: tasks.filter((t) => t.status === "PENDING").length,
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      COMPLETED: tasks.filter((t) => t.status === "COMPLETED").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <Layout userRole={user?.role} userName={user?.name}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      userRole={user?.role}
      userName={user?.name}
      onCreateTask={() => setCreateTaskOpen(true)}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage and track all workspace tasks ({tasks.length} total)
            </p>
          </div>

          {user?.role === "MANAGER" && (
            <Button onClick={() => setCreateTaskOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          )}
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
              <SelectItem value="ALL">
                All Status ({statusCounts.ALL})
              </SelectItem>
              <SelectItem value="PENDING">
                Pending ({statusCounts.PENDING})
              </SelectItem>
              <SelectItem value="IN_PROGRESS">
                In Progress ({statusCounts.IN_PROGRESS})
              </SelectItem>
              <SelectItem value="COMPLETED">
                Completed ({statusCounts.COMPLETED})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                ...task,
                assignee: task.assignedTo.name, // For backward compatibility
              }}
              userRole={user.role}
              onClick={() => handleTaskClick(task)}
              onEdit={() => handleEditTask(task)}
              onStatusChange={(status) => handleStatusChange(task.id, status)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tasks.length === 0
                ? "No tasks created yet. Create your first task to get started!"
                : "No tasks found matching your criteria."}
            </p>
            {tasks.length === 0 && user?.role === "MANAGER" && (
              <Button
                onClick={() => setCreateTaskOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Task
              </Button>
            )}
          </div>
        )}

        {/* Dialogs */}
        <CreateTaskDialog
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
        />

        <EditTaskDialog
          open={editTaskOpen}
          onOpenChange={setEditTaskOpen}
          task={editingTask}
        />

        <TaskNotesDialog
          key={selectedTask?.id || "no-task"}
          open={notesDialogOpen}
          onOpenChange={setNotesDialogOpen}
          task={
            selectedTask
              ? {
                  id: selectedTask.id,
                  title: selectedTask.title,
                  description: selectedTask.description,
                  status: selectedTask.status,
                  assignee: selectedTask.assignedTo.name,
                  createdDate: selectedTask.createdAt,
                  dueDate: selectedTask.dueDate,
                }
              : null
          }
        />
      </div>
    </Layout>
  );
}
