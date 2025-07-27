import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, Users, TrendingUp } from "lucide-react";
import { API_BASE_URL, getAuthHeader } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  status: string;
  assignedTo: { name: string };
  createdAt: string;
}

interface Workspace {
  name: string;
  workspaceNumber: number;
  members: { id: string; name: string }[];
  manager: { name: string; email: string };
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?.workspaceNumber) return;

        const headers = getAuthHeader();

        const resWorkspace = await fetch(
          `${API_BASE_URL}/workspaces/${user.workspaceNumber}`,
          { headers }
        );
        const workspaceData = await resWorkspace.json();
        setWorkspace(workspaceData.workspace);

        const resTasks = await fetch(
          `${API_BASE_URL}/tasks/${user.workspaceNumber}`,
          { headers }
        );
        const tasksData = await resTasks.json();
        setTasks(tasksData.tasks);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length.toString(),
      description: `+${tasks.length} total`,
      icon: CheckSquare,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value: tasks.filter((t) => t.status === "IN_PROGRESS").length.toString(),
      description: "Active tasks",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Team Members",
      value: workspace?.members.length.toString() || "0",
      description: "Active collaborators",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Completion Rate",
      value: `${Math.round(
        (tasks.filter((t) => t.status === "COMPLETED").length /
          (tasks.length || 1)) *
          100
      )}%`,
      description: "Based on task progress",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const recentTasks = [...tasks]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="default"
            className="bg-success text-success-foreground"
          >
            Completed
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="default"
            className="bg-warning text-warning-foreground"
          >
            In Progress
          </Badge>
        );
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Layout
      userRole={user?.role}
      userName={user?.name}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your workspace and team activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Latest task activity in your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned to {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
